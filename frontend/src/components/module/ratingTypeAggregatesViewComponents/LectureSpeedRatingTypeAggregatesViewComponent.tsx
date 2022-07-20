import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface LectureSpeedRatingTypeAggregatesViewComponentProps {
    academicYear: AcademicYear | null
}

export const LectureSpeedRatingTypeAggregatesViewComponent: React.FC<LectureSpeedRatingTypeAggregatesViewComponentProps> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Lecture Speed",
        description: "How fast the lectures were",
        apiString: "LECTURE_SPEED",
        values: ["Slow", "OK", "Fast"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.MEDIUM} />
    );
}