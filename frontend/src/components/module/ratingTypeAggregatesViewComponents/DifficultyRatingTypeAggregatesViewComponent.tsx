import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface Props {
    academicYear: AcademicYear | null
}

export const DifficultyRatingTypeAggregatesViewComponent: React.FC<Props> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Difficulty",
        description: "How difficult it was overall",
        apiString: "DIFFICULTY",
        values: ["Trivial", "Easy", "OK", "Difficult", "Hard"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.LARGE} />
    );
}