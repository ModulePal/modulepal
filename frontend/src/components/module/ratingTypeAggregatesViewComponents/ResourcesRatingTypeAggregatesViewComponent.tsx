import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface Props {
    academicYear: AcademicYear | null
}

export const ResourcesRatingTypeAggregatesViewComponent: React.FC<Props> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Resources",
        description: "How good the provided learning resources were",
        apiString: "RESOURCES",
        values: ["Bad", "OK", "Good"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.MEDIUM} />
    );
}