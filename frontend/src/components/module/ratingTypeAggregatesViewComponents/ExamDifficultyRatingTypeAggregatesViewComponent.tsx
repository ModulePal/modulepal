import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface ExamDifficultyRatingTypeAggregatesViewComponentProps {
    academicYear: AcademicYear | null
}

export const ExamDifficultyRatingTypeAggregatesViewComponent: React.FC<ExamDifficultyRatingTypeAggregatesViewComponentProps> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Exam Difficulty",
        description: "How difficult the exams were",
        apiString: "EXAM_DIFFICULTY",
        values: ["Easy", "OK", "Hard"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.MEDIUM} />
    );
}