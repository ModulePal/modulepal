import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

interface Props {
    academicYear: AcademicYear | null
}

export const ContentRatingTypeAggregatesViewComponent: React.FC<Props> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Content",
        description: "How exciting the content was overall",
        apiString: "CONTENT",
        values: ["Boring", "Meh", "OK", "Interesting", "Exciting"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.LARGE} />
    );
}