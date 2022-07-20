package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.grade.Grade;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AcademicYearAggregates {
    private Map<Grade, Average> gradeAggregates;
    private Average allGradeAggregate;

    public AcademicYearAggregates(me.omartanner.modulepal.data.aggregates.AcademicYearAggregates academicYearAggregates) {
        Map<Grade, me.omartanner.modulepal.data.aggregates.Average> gradeAggregatesMap = academicYearAggregates.getGradeAggregateMap();
        gradeAggregates = new HashMap<>(gradeAggregatesMap.size());
        for (Map.Entry<Grade, me.omartanner.modulepal.data.aggregates.Average> gradeAggregate : gradeAggregatesMap.entrySet()) {
            gradeAggregates.put(gradeAggregate.getKey(), new Average(gradeAggregate.getValue()));
        }
        allGradeAggregate = new Average(academicYearAggregates.getAllGradeAggregate());
    }
}
