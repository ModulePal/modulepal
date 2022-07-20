package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.ratingtype.RatingType;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentMap;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModuleAggregates {
    private Map<RatingType, RatingTypeAggregates> ratingTypeAggregates;

    public ModuleAggregates(me.omartanner.modulepal.data.aggregates.ModuleAggregates moduleAggregates) {
        ConcurrentMap<RatingType, me.omartanner.modulepal.data.aggregates.RatingTypeAggregates> ratingTypeRatingTypeAggregatesConcurrentMap = moduleAggregates.getRatingTypeAggregatesConcurrentHashMap();
        ratingTypeAggregates = new HashMap<>(ratingTypeRatingTypeAggregatesConcurrentMap.size());
        for (Map.Entry<RatingType, me.omartanner.modulepal.data.aggregates.RatingTypeAggregates> ratingTypeAggregatesEntry : ratingTypeRatingTypeAggregatesConcurrentMap.entrySet()) {
            ratingTypeAggregates.put(ratingTypeAggregatesEntry.getKey(), new RatingTypeAggregates(ratingTypeAggregatesEntry.getValue()));
        }
    }
}
