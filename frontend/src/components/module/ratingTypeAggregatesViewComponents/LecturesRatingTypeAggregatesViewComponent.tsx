import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface Props {
    academicYear: AcademicYear | null
}

export const LecturesRatingTypeAggregatesViewComponent: React.FC<Props> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Lectures",
        description: "How engaging the lectures were",
        apiString: "LECTURES",
        values: ["Boring", "Unengaging", "OK", "Engaging", "Captivating"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.LARGE} />
    );
}