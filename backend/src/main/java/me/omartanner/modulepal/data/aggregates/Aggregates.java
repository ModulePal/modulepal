package me.omartanner.modulepal.data.aggregates;

import lombok.Getter;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.data.h2.model.Rating;
import me.omartanner.modulepal.data.ratingtype.LikeRatingConstants;
import me.omartanner.modulepal.data.ratingtype.RatingType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.BiFunction;

// aggreggates

/*
    per module:
        per rating type:
           per year:
               all grades
               per g

           all years:
               all grades
               per g

 */

@Component
public class Aggregates {
    @Autowired
    private H2Manager h2Manager;

    @Getter
    private Map<String, ModuleAggregates> moduleAggregatesMap;

    @Getter
    private ConcurrentMap<String, Integer> ratingLikesMap; // for each rating id, the total number of likes

    @Getter
    private ConcurrentHashMap<String, Integer> ratingDislikesMap; // for each rating id, the total number of dislikes

    public Aggregates() {
        moduleAggregatesMap = new HashMap<>();
        ratingLikesMap = new ConcurrentHashMap<>();
        ratingDislikesMap = new ConcurrentHashMap<>();
    }

    // fills the moduleAggregatesMap with the data in the H2 database
    public void fill() {
        List<Rating> ratings = h2Manager.getExistingRatings();
        moduleAggregatesMap = new HashMap<>();
        for (Rating rating : ratings) {
            update(rating, true);
        }
    }

    public void update(Rating rating, boolean add) {
        RatingType ratingType = RatingType.fromId(rating.getTypeId());
        if (ratingType == null || ratingType.isTextual()) {
            return;
        }
        if (ratingType == RatingType.LIKE) {
            updateLikeAggregate(rating, add);
            return;
        }
        if (!ratingType.isRecursive()) {
            updateMetricAggregate(rating, add);
        }
    }

    public void updateMetricAggregate(Rating rating, boolean add) {
        RatingType ratingType = RatingType.fromId(rating.getTypeId());
        if (ratingType == null || ratingType.isTextual() || ratingType.isRecursive()) { // if rating type is textual then don't update aggregrate since comments don't have aggregrates. also don't handle recursive rating types here
            return;
        }
        ModuleAggregates moduleAggregates = moduleAggregatesMap.get(rating.getModule().getModuleId());
        if (moduleAggregates == null) {
            moduleAggregates = new ModuleAggregates();
            moduleAggregatesMap.put(rating.getModule().getModuleId(), moduleAggregates);
        }
        Grade grade = Grade.fromId(rating.getGrade());
        moduleAggregates.update(
                ratingType,
                rating.getAcademicYear(),
                grade,
                Integer.parseInt(rating.getValue()),
                add
        );
    }

    public void updateLikeAggregate(Rating rating, boolean add) {
        if (rating.getTypeId() == null || rating.getTypeId() != RatingType.LIKE.id()) {
            return;
        }

        Rating targetRating = rating.getTargetRating();

        if (targetRating == null || rating.getValue() == null || (!rating.getValue().equals(LikeRatingConstants.LIKE_VALUE) && !rating.getValue().equals(LikeRatingConstants.DISLIKE_VALUE))) {
            return;
        }

        BiFunction<String, Integer, Integer> likeRemapper = (targetRatingId, curValue) -> {
            if (curValue == null) {
                curValue = 0; // likes are defaulted to 0
            }
            // compute delta
            int delta = add ? 1 : -1;
            return curValue + delta;
        };

        boolean liked = rating.getValue().equals(LikeRatingConstants.LIKE_VALUE);

        if (liked) {
            ratingLikesMap.compute(targetRating.getRatingId(), likeRemapper);
        }
        else {
            ratingDislikesMap.compute(targetRating.getRatingId(), likeRemapper);
        }
    }

    public ModuleAggregates getModuleAggregates(String moduleCode) {
        if (moduleAggregatesMap == null) return null;
        return moduleAggregatesMap.get(moduleCode);
    }

    public Map<RatingType, RatingTypeAggregates> getModuleAggregatesByRatingType(String moduleCode, Set<RatingType> ratingTypes) {
        ModuleAggregates moduleAggregates = getModuleAggregates(moduleCode);
        if (moduleAggregates == null) return null;
        Map<RatingType, RatingTypeAggregates> ratingTypeAggregatesMap = moduleAggregates.getRatingTypeAggregatesConcurrentHashMap();
        Map<RatingType, RatingTypeAggregates> result = new HashMap<>(ratingTypes.size());
        for (RatingType ratingType : ratingTypes) {
            result.put(ratingType, ratingTypeAggregatesMap.get(ratingType));
        }
        return result;
    }

    public Integer getTextualRatingLikes(String ratingId, boolean likes) {
        Integer value = likes ? ratingLikesMap.get(ratingId) : ratingDislikesMap.get(ratingId);
        return value == null ? 0 : value;
    }

    @Override
    public String toString() {
        return "Aggregates{" +
                "moduleAggregatesMap=" + moduleAggregatesMap +
                '}';
    }
}
