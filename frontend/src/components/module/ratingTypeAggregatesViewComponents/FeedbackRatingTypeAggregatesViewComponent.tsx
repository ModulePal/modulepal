import React from "react";
import { AcademicYear } from "../context/ModuleMetadataContext";
import { RatingType, ModuleRatingTypeAggregatesComponent, AggregatesCardSize } from "../ModuleRatingTypeAggregatesComponent";

export interface Props {
    academicYear: AcademicYear | null
}

export const FeedbackRatingTypeAggregatesViewComponent: React.FC<Props> = ({ academicYear }) => {
    const ratingType: RatingType = {
        title: "Feedback",
        description: "How good and timely the feedback was",
        apiString: "FEEDBACK",
        values: ["None", "Poor", "OK", "Good", "Great"]
    }

    return (
        <ModuleRatingTypeAggregatesComponent ratingType={ratingType} academicYear={academicYear} size={AggregatesCardSize.LARGE} />
    );
}