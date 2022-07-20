package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingTypeAggregates {
    private Map<String, AcademicYearAggregates> academicYearAggregates;
    private AcademicYearAggregates allAcademicYearAggregates;

    public RatingTypeAggregates(me.omartanner.modulepal.data.aggregates.RatingTypeAggregates ratingTypeAggregates) {
        Map<String, me.omartanner.modulepal.data.aggregates.AcademicYearAggregates> academicYearAggregatesMap = ratingTypeAggregates.getAcademicYearAggregatesMap();
        academicYearAggregates = new HashMap<>(academicYearAggregatesMap.size());
        for (Map.Entry<String, me.omartanner.modulepal.data.aggregates.AcademicYearAggregates> academicYearAggregatesEntry : academicYearAggregatesMap.entrySet()) {
            academicYearAggregates.put(academicYearAggregatesEntry.getKey(), new AcademicYearAggregates(academicYearAggregatesEntry.getValue()));
        }
        allAcademicYearAggregates = new AcademicYearAggregates(ratingTypeAggregates.getAllAcademicYearAggregrates());
    }
}
