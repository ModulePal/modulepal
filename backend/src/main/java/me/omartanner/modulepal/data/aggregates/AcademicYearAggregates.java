package me.omartanner.modulepal.data.aggregates;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.grade.Grade;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class AcademicYearAggregates {
    private Map<Grade, Average> gradeAggregateMap;
    private Average allGradeAggregate;

    public AcademicYearAggregates() {
        gradeAggregateMap = new HashMap<>();
        allGradeAggregate = new Average();
    }

    public void update(Grade grade, int value,boolean add) {
        allGradeAggregate.update(value, add);
        Average gradeAggregrate = gradeAggregateMap.get(grade);
        if (gradeAggregrate == null) {
            gradeAggregrate = new Average();
            gradeAggregateMap.put(grade, gradeAggregrate);
        }
        gradeAggregrate.update(value, add);
    }
}
