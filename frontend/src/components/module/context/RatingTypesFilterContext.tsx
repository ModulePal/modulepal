import React, { useState, useContext } from "react";
import { RatingBasicData } from "../../../services/rest/dto/RatingBasicData";
import { ApiResponse } from "../../../services/rest/ApiResponse";
import { ModuleRatingGetResponseBody } from "../../../services/rest/responses/body/ModuleRatingGetResponseBody";
import { API_RATING_TYPES } from "../../../services/rest/api";
import { AuthContext } from "../../../services/firebase/AuthStore";

interface ModuleMyRatingsDataFunctional {
    currentRatingTypes: string[],
    toggleRatingType: (ratingType: string) => void
    showAllRatingTypes: () => void
    hideAllRatingTypes: () => void,
    bulkAddReview: boolean | null,
    updateBulkAddReview: (value: boolean) => void
}

export const RatingTypesFilterContext = React.createContext<ModuleMyRatingsDataFunctional>({
    currentRatingTypes: API_RATING_TYPES,
    toggleRatingType: () => {},
    showAllRatingTypes: () => {},
    hideAllRatingTypes: () => {},
    bulkAddReview: null,
    updateBulkAddReview: () => {}
});

export const RatingTypesFilterProvider = ({ children }) => {
    const [currentRatingTypes, setCurrentRatingTypes] = useState(API_RATING_TYPES);
    const [bulkAddReview, setBulkAddReview] = useState(false);

    const currentUser = useContext(AuthContext);

    function toggleRatingType(ratingType: string) {
        if (!currentRatingTypes) {
            setCurrentRatingTypes([ratingType]);
        }
        else {
            if (currentRatingTypes.includes(ratingType)) {
                setCurrentRatingTypes(currentRatingTypes.filter(currentRatingType => currentRatingType !== ratingType));
            }
            else {
                setCurrentRatingTypes([...currentRatingTypes, ratingType]);
            }
        }
    }

    function showAllRatingTypes() {
        setCurrentRatingTypes(API_RATING_TYPES);
    }

    function hideAllRatingTypes() {
        setCurrentRatingTypes([]);
    }

    return (
        <RatingTypesFilterContext.Provider value={{currentRatingTypes: currentRatingTypes, toggleRatingType: toggleRatingType, showAllRatingTypes: showAllRatingTypes, hideAllRatingTypes: hideAllRatingTypes, bulkAddReview: bulkAddReview, updateBulkAddReview: value => setBulkAddReview(value)}}>
            {children}
        </RatingTypesFilterContext.Provider>
    );
}