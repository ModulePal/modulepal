import { AcademicYearAggregates } from "./AcademicYearAggregates";

export interface RatingTypeAggregates {
    academicYearAggregates: Record<string, AcademicYearAggregates>
    allAcademicYearAggregates: AcademicYearAggregates
}