package me.omartanner.modulepal.data.aggregates;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.grade.Grade;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class RatingTypeAggregates {
    private Map<String, AcademicYearAggregates> academicYearAggregatesMap;
    private AcademicYearAggregates allAcademicYearAggregrates;

    public RatingTypeAggregates() {
        academicYearAggregatesMap = new HashMap<>();
        allAcademicYearAggregrates = new AcademicYearAggregates();
    }

    public void update(String academicYear, Grade grade, int value, boolean add) {
        allAcademicYearAggregrates.update(grade, value, add);
        AcademicYearAggregates academicYearAggregates = academicYearAggregatesMap.get(academicYear);
        if (academicYearAggregates == null) {
            academicYearAggregates = new AcademicYearAggregates();
            academicYearAggregatesMap.put(academicYear, academicYearAggregates);
        }
        academicYearAggregates.update(grade, value, add);
    }
}
