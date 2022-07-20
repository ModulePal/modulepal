package me.omartanner.modulepal.data.aggregates;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.data.ratingtype.RatingType;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.BiFunction;

@Data
@AllArgsConstructor
public class ModuleAggregates {
    private ConcurrentMap<RatingType, RatingTypeAggregates> ratingTypeAggregatesConcurrentHashMap;

    public ModuleAggregates() {
        ratingTypeAggregatesConcurrentHashMap = new ConcurrentHashMap<>();
    }

    public void update(RatingType ratingType, String academicYear, Grade grade, int value, boolean add) {
        ratingTypeAggregatesConcurrentHashMap.compute(ratingType, (ratingType1, ratingTypeAggregates) -> {
            RatingTypeAggregates result = ratingTypeAggregates == null ? new RatingTypeAggregates() : ratingTypeAggregates;
            result.update(academicYear, grade, value, add);
            return result;
        });
    }
}
