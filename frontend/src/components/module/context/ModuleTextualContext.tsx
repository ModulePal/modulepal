import React, { useState, useContext } from "react";
import { ApiResponse } from "../../../services/rest/ApiResponse";
import { getModuleRatings, API_GRADES, API_LIKE_VALUE } from "../../../services/rest/api";
import { AuthContext } from "../../../services/firebase/AuthStore";
import { RatingBasicData } from "../../../services/rest/dto/RatingBasicData";
import { ModuleRatingGetResponseBody } from "../../../services/rest/responses/body/ModuleRatingGetResponseBody";
import { stringToDate } from "../../../services/helper/time-helper";
import { getErrorResponse } from "../../../services/rest/error";
import { SelectedModuleContext } from "../../context/SelectedModuleContext";
import { computeTextualLikePercentage } from "../TextualsHelper";

export interface LikeMetadata {
    liked: boolean,
    ratingId: string,
    targetRatingId: string
}

export interface TextualDisplayStrings {
    singular: string,
    plural: string,
    pastAction: string, // e.g. commented, suggested
    futureAction: string // e.g. to comment, to suggest,
    progressiveAction: string // e.g. they are commenting, they are suggesting
}

export interface ModuleTextualDataFunctional {
    sortedTextuals: RatingBasicData[] | null,
    sort: TextualsSort | null,
    gradeFilterValues: string[],
    textualRatings: Record<string, RatingBasicData> | null,
    myTextualsIds: string[] | null,
    myLikes: LikeMetadata[] | null,
    updateTextuals: (grades: string[] | null, academicYears: string[] | null, onlyMyRatings: boolean, refresh: boolean) => Promise<[ApiResponse<ModuleRatingGetResponseBody>, ApiResponse<ModuleRatingGetResponseBody>] | null>,
    removeTextual: (ratingId: string) => void,
    updateSort: (sort: TextualsSort) => void,
    updateGradeFilterValues: (values: string[]) => void,
    toggleGrade: (grade: string) => void,
    showAllGrades: () => void,
    hideAllGrades: () => void,
    removeLikeRating: (ratingId: string) => void,
    addLikeRating: (likeMetadata: LikeMetadata) => void,
    replaceLikeRating: (ratingIdRemove: string, newLikeMetadata: LikeMetadata) => void,
    updateRatingIdLikes: (ratingId: string, likes: boolean, delta: number) => void
}

export function generateTextualContext() {
    const ModuleTextualsContext = React.createContext<ModuleTextualDataFunctional>({
        sortedTextuals: null,
        sort: null,
        gradeFilterValues: API_GRADES,
        textualRatings: null,
        myTextualsIds: null,
        myLikes: null,
        updateTextuals: async () => null,
        removeTextual: () => {},
        updateSort: () => {},
        updateGradeFilterValues: () => {},
        toggleGrade: () => {},
        showAllGrades: () => {},
        hideAllGrades: () => {},
        removeLikeRating: () => {},
        addLikeRating: () => {},
        replaceLikeRating: () => {},
        updateRatingIdLikes: () => {}
    });
    return ModuleTextualsContext;
}

export enum TextualsSort {
    BEST_RATED,
    WORST_RATED,
    NEWEST,
    OLDEST
}

export function generateTextualProvider(textualsContext: React.Context<ModuleTextualDataFunctional>, apiRatingType: string) {
    const ModuleTextualsProvider = ({ children }) => {
        const moduleContext = useContext(SelectedModuleContext);
        const currentUser = useContext(AuthContext);
    
        const [sort, setSort] = useState<TextualsSort>(TextualsSort.BEST_RATED);
        const [currentGradeFilterValues, setCurrentGradeFilterValues] = useState<string[]>(API_GRADES);
        const [currentTextualRatings, setCurrentTextualRatings] = useState<Record<string, RatingBasicData> | null>(null);
        const [currentMyTextualsIds, setCurrentMyTextualsIds] = useState<string[] | null>(null);
        const [currentMyLikes, setCurrentMyLikes] = useState<LikeMetadata[] | null>(null);

        function toggleGrade(grade: string) {
            if (!currentGradeFilterValues) {
                setCurrentGradeFilterValues([grade]);
            }
            else {
                if (currentGradeFilterValues.includes(grade)) {
                    setCurrentGradeFilterValues(currentGradeFilterValues.filter(currentGrade => currentGrade !== grade));
                }
                else {
                    setCurrentGradeFilterValues([...currentGradeFilterValues, grade]);
                }
            }
        }
    
        function showAllGrades() {
            setCurrentGradeFilterValues(API_GRADES);
        }
    
        function hideAllGrades() {
            setCurrentGradeFilterValues([]);
        }
    
        function generateSortedTextuals(): RatingBasicData[] {
            const textuals = !!currentTextualRatings ? Object.keys(currentTextualRatings).map(key => currentTextualRatings[key]) : [];
            if (textuals.length === 0) {
                return textuals;
            }
            // first apply filter, then sort
            var filteredTextuals = textuals;
            if (!!currentGradeFilterValues) {
                filteredTextuals = textuals.filter(textual => currentGradeFilterValues.includes(textual.grade!!));
            }
            var sortedTextuals = filteredTextuals;
            const likeSort: boolean = sort === TextualsSort.BEST_RATED || sort === TextualsSort.WORST_RATED;
            const sortAsc: boolean = sort === TextualsSort.WORST_RATED || sort === TextualsSort.OLDEST;
            sortedTextuals = filteredTextuals.sort((textual1, textual2) => {
                var comparisonValue: number = 0;
                const t1 = stringToDate(textual1.time);
                const t2 = stringToDate(textual2.time);
                if (!t1 || !t2) {
                    return 0;
                }
                const v1 = t1.getTime();
                const v2 = t2.getTime();
                if (v1 !== v2) comparisonValue = v1 > v2 ? 1 : -1;
                if (likeSort) {
                    const textual1LikePercentage = computeTextualLikePercentage(textual1);
                    const textual2LikePercentage = computeTextualLikePercentage(textual2);
                    if (textual1LikePercentage === null || textual2LikePercentage === null) {
                        return 0;
                    }
                    if (textual1LikePercentage !== textual2LikePercentage) comparisonValue = textual1LikePercentage > textual2LikePercentage ? 1 : -1;
                }
                if (!sortAsc) {
                    comparisonValue *= -1;
                }
                return comparisonValue;
            });
            return sortedTextuals;
        }
    
        async function updateTextualsInCurrentState(grades: string[] | null, academicYears: string[] | null, onlyMyRatings: boolean, refresh: boolean): Promise<[ApiResponse<ModuleRatingGetResponseBody>, ApiResponse<ModuleRatingGetResponseBody>] | null> {
            if (!!moduleContext.moduleCode) {
                const idToken = (!!currentUser.idToken && !!currentUser.user && !currentUser.user.emailVerified && !currentUser.anonymous) ? null : currentUser.idToken;
                return updateTextuals(
                    idToken,
                    moduleContext.moduleCode,
                    grades,
                    academicYears,
                    onlyMyRatings,
                    refresh
                );
            }
            return null;
        }
    
        function removeTextual(ratingId: string) {
            if (!!currentTextualRatings) {
                const newCommentRatings = currentTextualRatings;
                delete newCommentRatings[ratingId];
                setCurrentTextualRatings(newCommentRatings);
            }
            if (!!currentMyTextualsIds) {
                const newMyCommentIds = currentMyTextualsIds.filter(textualId => textualId !== ratingId);
                setCurrentMyTextualsIds(newMyCommentIds);
            }
        }
    
        async function updateTextuals(idToken: string | null, moduleCode: string, grades: string[] | null, academicYears: string[] | null, onlyMyRatings: boolean, refresh: boolean): Promise<[ApiResponse<ModuleRatingGetResponseBody>, ApiResponse<ModuleRatingGetResponseBody>]> {
            const moduleRatingsRequest = getModuleRatings(idToken, {
                moduleCode: moduleCode,
                grades: grades,
                academicYears: academicYears,
                ratingTypes: [apiRatingType],
                onlyMyRatings: onlyMyRatings
            });
            const likesRequest = getModuleRatings(idToken, {
                moduleCode: moduleCode,
                grades: API_GRADES,
                academicYears: academicYears,
                ratingTypes: ["LIKE"],
                onlyMyRatings: true
            }); // also get LIKE ratings
            const fullResponse = await Promise.all([moduleRatingsRequest, likesRequest]);
            const moduleRatingsResponse = fullResponse[0];
            const likesResponse = fullResponse[1];

            if (!getErrorResponse(moduleRatingsResponse) && !getErrorResponse(likesResponse)) {
                const ratings = moduleRatingsResponse.response!!.body.ratings;
                var myRatings: string[] = [];
                var newRatings: Record<string, RatingBasicData> = {};
                var newSortedTextuals: RatingBasicData[] = [];
            
                ratings.forEach(rating => {
                    if (!newRatings[rating.ratingId] && (refresh || !currentTextualRatings || !currentTextualRatings[rating.ratingId])) {
                        newRatings[rating.ratingId] = rating;
                        newSortedTextuals.push(rating);
                        if (rating.myRating) {
                            myRatings.push(rating.ratingId);
                        }
                    }
                });

                // now merge
                var newTextualRatings: Record<string, RatingBasicData> = refresh ? {} : (!!currentTextualRatings ? currentTextualRatings : {});
                var newMyTextualsIds: string[] = refresh ? [] : (!!currentMyTextualsIds ? currentMyTextualsIds : []);
                for (let newRatingId in newRatings) {
                    if (!newTextualRatings[newRatingId]) {
                        newTextualRatings[newRatingId] = newRatings[newRatingId];
                        if (newRatings[newRatingId].myRating) {
                            newMyTextualsIds.push(newRatingId);
                        }
                    }
                }
                setCurrentTextualRatings(newTextualRatings);
                setCurrentMyTextualsIds(newMyTextualsIds);

                // update like ratings
                const myLikes: LikeMetadata[] = likesResponse.response!!.body.ratings.map(ratingBasicData => {
                    return {
                        liked: ratingBasicData.value === API_LIKE_VALUE,
                        ratingId: ratingBasicData.ratingId,
                        targetRatingId: ratingBasicData.targetRatingId!!,
                    }
                });
                setCurrentMyLikes(myLikes);
            }
            
            return fullResponse;
        }

        function addLikeRating(likeMetadata: LikeMetadata) {
            if (!currentMyLikes || currentMyLikes.length === 0) {
                setCurrentMyLikes([likeMetadata]);
                return;
            }
            if (currentMyLikes.some(like => like.ratingId === likeMetadata.ratingId)) {
                return;
            }
            const newMyLikes = [...currentMyLikes, likeMetadata];
            setCurrentMyLikes(newMyLikes);
        }

        function removeLikeRating(ratingId: string) {
            if (!currentMyLikes || currentMyLikes.length === 0) return;
            const newMyLikes = currentMyLikes.filter(like => like.ratingId !== ratingId);
            setCurrentMyLikes(newMyLikes);
        }

        function replaceLikeRating(ratingIdRemove: string, newLikeMetadata: LikeMetadata) {
            if (!currentMyLikes || currentMyLikes.length === 0) {
                setCurrentMyLikes([newLikeMetadata]);
                return;
            }
            var newMyLikes = currentMyLikes.filter(like => like.ratingId !== ratingIdRemove);
            if (!newMyLikes.some(like => like.ratingId === newLikeMetadata.ratingId)) {
                newMyLikes.push(newLikeMetadata);
            }
            setCurrentMyLikes(newMyLikes);
        }

        function updateRatingIdLikes(ratingId: string, liked: boolean, delta: number) {
            if (!currentTextualRatings) return;
            var ratingBasicData = currentTextualRatings[ratingId];
            if (!ratingBasicData || (liked && ratingBasicData.likes === null) || (!liked && ratingBasicData.dislikes === null)) return;
            if (liked) {
                const likes: number = ratingBasicData.likes!!;
                ratingBasicData.likes = likes + delta;
            }
            else {
                const dislikes: number = ratingBasicData.dislikes!!;
                ratingBasicData.dislikes = dislikes + delta;
            }
            const newTextualRatings = currentTextualRatings;
            newTextualRatings[ratingId] = ratingBasicData;
            setCurrentTextualRatings(newTextualRatings);
        }
    
        return (
            <textualsContext.Provider
                value={{
                    sortedTextuals: generateSortedTextuals(), 
                    textualRatings: currentTextualRatings, 
                    myTextualsIds: currentMyTextualsIds,
                    myLikes: currentMyLikes,
                    updateTextuals: updateTextualsInCurrentState, 
                    removeTextual: removeTextual,
                    gradeFilterValues: currentGradeFilterValues,
                    sort: sort,
                    updateGradeFilterValues: setCurrentGradeFilterValues,
                    updateSort: setSort,
                    toggleGrade: toggleGrade,
                    showAllGrades: showAllGrades,
                    hideAllGrades: hideAllGrades,
                    addLikeRating: addLikeRating,
                    removeLikeRating: removeLikeRating,
                    replaceLikeRating: replaceLikeRating,
                    updateRatingIdLikes: updateRatingIdLikes
                }}
            >
                {children}
            </textualsContext.Provider>
        );
    };

    return ModuleTextualsProvider;
}

