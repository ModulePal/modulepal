import { Average } from "./Average";

export interface AcademicYearAggregates {
    gradeAggregates: Record<string, Average>
    allGradeAggregate: Average
}