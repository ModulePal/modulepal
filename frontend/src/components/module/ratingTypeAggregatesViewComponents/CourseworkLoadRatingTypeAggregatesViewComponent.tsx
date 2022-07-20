import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface Props {
    academicYear: AcademicYear | null
}

export const CourseworkLoadRatingTypeAggregatesViewComponent: React.FC<Props> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Coursework Load",
        description: "How much coursework there was",
        apiString: "COURSEWORK_LOAD",
        values: ["Light", "Normal", "Heavy"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.MEDIUM} />
    );
}