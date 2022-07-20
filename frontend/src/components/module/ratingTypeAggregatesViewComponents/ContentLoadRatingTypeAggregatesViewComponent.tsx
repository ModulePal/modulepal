import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface ContentLoadRatingTypeAggregatesViewComponentProps {
    academicYear: AcademicYear | null
}

export const ContentLoadRatingTypeAggregatesViewComponent: React.FC<ContentLoadRatingTypeAggregatesViewComponentProps> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Content Load",
        description: "How much examinable content there was",
        apiString: "CONTENT_LOAD",
        values: ["Light", "Normal", "Heavy"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.MEDIUM} />
    );
}