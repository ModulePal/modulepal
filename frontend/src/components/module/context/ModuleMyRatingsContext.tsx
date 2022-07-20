import React, { useState, useContext, useEffect } from "react";
import { ApiResponse } from "../../../services/rest/ApiResponse";
import { ModuleBasicDataResponseBody } from "../../../services/rest/responses/body/ModuleBasicDataResponseBody";
import { getModuleAcademicYearRange, getModuleRatings, removeRating, API_RATING_TYPES } from "../../../services/rest/api";
import { ModuleRatingAcademicYearRangeResponseBody } from "../../../services/rest/responses/body/ModuleRatingAcademicYearRangeResponseBody";
import { ModuleContext } from "./ModuleContext";
import { AuthContext, authorisedUser } from "../../../services/firebase/AuthStore";
import { RatingBasicData } from "../../../services/rest/dto/RatingBasicData";
import { AcademicYear } from "./ModuleMetadataContext";
import { ModuleRatingGetResponseBody } from "../../../services/rest/responses/body/ModuleRatingGetResponseBody";
import { ModuleRatingsQuery } from "../../../services/rest/dto/ModuleRatingsQuery";
import { getErrorResponse } from "../../../services/rest/error";
import { SelectedModuleContext } from "../../context/SelectedModuleContext";


interface ModuleMyRatingsDataFunctional {
    myRatings: Record<string, RatingBasicData> | null
    ratingTypeRatings: Record<string, string[]> | null
    updateMyRatings: (ratingTypes: string[] | null, grades: string[] | null, academicYears: string[] | null, refresh: boolean) => Promise<ApiResponse<ModuleRatingGetResponseBody> | null>,
    removeRating: (ratingId: string) => void,
    addRating: (ratingBasicData: RatingBasicData) => void,
    loadingRatingTypes: string[]
}

export const ModuleMyRatingsContext = React.createContext<ModuleMyRatingsDataFunctional>({
    myRatings: null,
    ratingTypeRatings: null,
    updateMyRatings: async () => null,
    removeRating: () => {},
    addRating: () => {},
    loadingRatingTypes: []
});

export const ModuleMyRatingsProvider = ({ children }) => {
    const moduleContext = useContext(SelectedModuleContext);
    const currentUser = useContext(AuthContext);

    const [currentMyRatings, setCurrentMyRatings] = useState<Record<string, RatingBasicData> | null>(null);
    const [currentRatingTypeRatings, setCurrentRatingTypeRatings] = useState<Record<string, string[]> | null>(null);
    const [loadingRatingTypes, setLoadingRatingTypes] = useState<string[]>([]);

    useEffect(() => {
        if (!!currentUser.idToken) {
            updateMyRatingsInCurrentState(
                API_RATING_TYPES,
                null, 
                null, 
                true
            );
        }
    }, [moduleContext, currentUser]);

    async function updateMyRatingsInCurrentState(ratingTypes: string[] | null, grades: string[] | null, academicYears: string[] | null, refresh: boolean): Promise<ApiResponse<ModuleRatingGetResponseBody> | null> {
        if (authorisedUser(currentUser) && !!moduleContext.moduleCode) {
            const result = updateMyRatings(
                currentUser.idToken!!,
                moduleContext.moduleCode,
                ratingTypes,
                grades,
                academicYears,
                refresh
            );
            return result;
        }
        return null;
    }

    function addRating(ratingBasicData: RatingBasicData) {
        var newMyRatings = currentMyRatings;
        var newRatingTypeRatings = currentRatingTypeRatings;
        if (!newMyRatings) {
            newMyRatings = {};
        }
        if (!newRatingTypeRatings) {
            newRatingTypeRatings = {};
        }
        const ratingId = ratingBasicData.ratingId;
        if (!newMyRatings[ratingId]) { // not already in
            newMyRatings[ratingId] = ratingBasicData;
            const ratingType = ratingBasicData.ratingType!!;
            if (!newRatingTypeRatings[ratingType]) {
                newRatingTypeRatings[ratingType] = [];
            }
            newRatingTypeRatings[ratingType].push(ratingId);
            setCurrentMyRatings(newMyRatings);
            setCurrentRatingTypeRatings(newRatingTypeRatings);
        }
    }

    function removeRating(ratingId: string) {
        if (!!currentMyRatings) {
            const newMyRatings = currentMyRatings;
            const rating = currentMyRatings[ratingId];
            if (!!rating) {
                delete newMyRatings[ratingId];
                setCurrentMyRatings(newMyRatings);
                if (!!currentRatingTypeRatings) {
                    const newRatingTypeRatings = currentRatingTypeRatings;
                    newRatingTypeRatings[rating.ratingType!!] = newRatingTypeRatings[rating.ratingType!!].filter(ratingTypeRatingId => ratingTypeRatingId !== ratingId);
                    if (newRatingTypeRatings[rating.ratingType!!].length === 0) {
                        delete newRatingTypeRatings[rating.ratingType!!];
                    }
                    setCurrentRatingTypeRatings(newRatingTypeRatings);
                }
            }
        }
    }

    async function updateMyRatings(idToken: string, moduleCode: string, ratingTypes: string[] | null, grades: string[] | null, academicYears: string[] | null, refresh: boolean): Promise<ApiResponse<ModuleRatingGetResponseBody>> {
        setLoadingRatingTypes(ratingTypes ?? API_RATING_TYPES);
        const moduleRatingsResponse = await getModuleRatings(idToken, {
            moduleCode: moduleCode,
            grades: grades,
            academicYears: academicYears,
            ratingTypes: ratingTypes,
            onlyMyRatings: true
        });
        const errorResponse = getErrorResponse(moduleRatingsResponse);
        if (!errorResponse) {
            const body = moduleRatingsResponse.response!!.body;
            const ratings = body.ratings;
            var newRatingTypeRatings: Record<string, string[]> = {};
            var newRatings: Record<string, RatingBasicData> = {};
            ratings.forEach(rating => {
                if (!newRatings[rating.ratingId] && (refresh || !currentMyRatings || !currentMyRatings[rating.ratingId])) {
                    newRatings[rating.ratingId] = rating;
                    if (!newRatingTypeRatings[rating.ratingType]) {
                        newRatingTypeRatings[rating.ratingType] = [];
                    }
                    newRatingTypeRatings[rating.ratingType].push(rating.ratingId);
                }
            });
            // now merge
            var updatedMyRatings: Record<string, RatingBasicData> = refresh ? {} : (!!currentMyRatings ? currentMyRatings : {});
            var updatedRatingTypeRatings: Record<string, string[]> = refresh ? {} : (!!currentRatingTypeRatings ? currentRatingTypeRatings : {});
            for (let newRatingId in newRatings) {
                if (!updatedMyRatings[newRatingId]) {
                    updatedMyRatings[newRatingId] = newRatings[newRatingId];
                    let rating = newRatings[newRatingId];
                    if (!updatedRatingTypeRatings[rating.ratingType!!]) {
                        updatedRatingTypeRatings[rating.ratingType!!] = [];
                    }
                    updatedRatingTypeRatings[rating.ratingType!!].push(newRatingId);
                }
            }
            setCurrentMyRatings(updatedMyRatings);
            setCurrentRatingTypeRatings(updatedRatingTypeRatings);
        }
        setLoadingRatingTypes([]);
        return moduleRatingsResponse;
    }

    const value = 
        <ModuleMyRatingsContext.Provider
            value={{myRatings: currentMyRatings, ratingTypeRatings: currentRatingTypeRatings, updateMyRatings: updateMyRatingsInCurrentState, removeRating: removeRating, addRating: addRating, loadingRatingTypes: loadingRatingTypes}}
        >
            {children}
        </ModuleMyRatingsContext.Provider>
    return value;
};