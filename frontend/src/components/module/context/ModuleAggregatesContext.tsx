import { ModuleBasicData } from "../../../services/rest/dto/ModuleBasicData";
import { ApiResponse } from "../../../services/rest/ApiResponse";
import { ModuleBasicDataResponseBody } from "../../../services/rest/responses/body/ModuleBasicDataResponseBody";
import React, { useState, useContext, useEffect } from "react";
import { ModuleAggregates } from "../../../services/rest/dto/ModuleAggregates";
import { ModuleContext } from "./ModuleContext";
import { AuthContext, authorisedUser } from "../../../services/firebase/AuthStore";
import { ModuleRatingAggregatesQuery } from "../../../services/rest/dto/ModuleRatingAggregatesQuery";
import { ModuleRatingAggregateGetResponseBody } from "../../../services/rest/responses/body/ModuleRatingAggregateGetResponseBody";
import { RatingTypeAggregates } from "../../../services/rest/dto/RatingTypeAggregates";
import { getModuleRatingAggregates, API_RATING_TYPES } from "../../../services/rest/api";
import { getErrorResponse } from "../../../services/rest/error";
import { validateLocaleAndSetLanguage } from "typescript";
import { SelectedModuleContext } from "../../context/SelectedModuleContext";

interface ModuleAggregatesDataFunctional {
    moduleAggregates: ModuleAggregates | null,
    updateModuleAggregates: (ratingTypes: string[] | null, showLoader: boolean) => Promise<ApiResponse<ModuleRatingAggregateGetResponseBody> | null>,
    loadingTypes: string[]
}

interface ModuleRatingTypeAggregatesDataFunctional {
    ratingTypeAggregates: RatingTypeAggregates | null,
    updateRatingTypeAggregates: (showLoader: boolean) => Promise<ApiResponse<ModuleRatingAggregateGetResponseBody> | null>
}

export const ModuleAggregatesContext = React.createContext<ModuleAggregatesDataFunctional>({
    moduleAggregates: null,
    updateModuleAggregates: async () => null,
    loadingTypes: []
});

export const DifficultyRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const ContentRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const CourseworkLoadRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const ExamDifficultyRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const ContentLoadRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const SupportRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const LecturesRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const LectureSpeedRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const FeedbackRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

export const ResourcesRatingTypeAggregatesContext = React.createContext<ModuleRatingTypeAggregatesDataFunctional>({
    ratingTypeAggregates: null,
    updateRatingTypeAggregates: async () => null
});

const ratingTypeContextMap: Record<string, React.Context<ModuleRatingTypeAggregatesDataFunctional>> = {
    "DIFFICULTY": DifficultyRatingTypeAggregatesContext,
    "CONTENT": ContentRatingTypeAggregatesContext,
    "COURSEWORK_LOAD": CourseworkLoadRatingTypeAggregatesContext,
    "EXAM_DIFFICULTY": ExamDifficultyRatingTypeAggregatesContext,
    "CONTENT_LOAD": ContentLoadRatingTypeAggregatesContext,
    "SUPPORT": SupportRatingTypeAggregatesContext,
    "LECTURES": LecturesRatingTypeAggregatesContext,
    "LECTURE_SPEED": LectureSpeedRatingTypeAggregatesContext,
    "FEEDBACK": FeedbackRatingTypeAggregatesContext,
    "RESOURCES": ResourcesRatingTypeAggregatesContext
}

export function getRatingContext(ratingContextApiString: string): React.Context<ModuleRatingTypeAggregatesDataFunctional> {
    return ratingTypeContextMap[ratingContextApiString];
}

export const ModuleAggregatesProvider = ({ children }) => {
    const moduleContext = useContext(SelectedModuleContext);
    const currentUser = useContext(AuthContext);

    const [loadingTypes, setLoadingTypes] = useState<string[]>([]);
    // const [currentRatingTypeFilterValues, setCurrentRatingTypeFilterValues] = useState<string[]>(API_RATING_TYPES);

    const [currentModuleAggregates, setCurrentModuleAggregates] = useState<ModuleAggregates | null>(null);
    const [currentDifficultyRatingTypeAggregates, setCurrentDifficultyRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentContentRatingTypeAggregates, setCurrentContentRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentCourseworkLoadRatingTypeAggregates, setCurrentCourseworkLoadRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentExamDifficultyRatingTypeAggregates, setCurrentExamDifficultyRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentContentLoadRatingTypeAggregates, setCurrentContentLoadRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentSupportRatingTypeAggregates, setCurrentSupportRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentLecturesRatingTypeAggregates, setCurrentLecturesRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentLectureSpeedRatingTypeAggregates, setCurrentLectureSpeedRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentFeedbackRatingTypeAggregates, setCurrentFeedbackRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);
    const [currentResourcesRatingTypeAggregates, setCurrentResourcesRatingTypeAggregates] = useState<RatingTypeAggregates | null>(null);

    const ratingTypeStateUpdaterMap: Record<string, React.Dispatch<React.SetStateAction<RatingTypeAggregates | null>>> = {
        "DIFFICULTY": setCurrentDifficultyRatingTypeAggregates,
        "CONTENT": setCurrentContentRatingTypeAggregates,
        "COURSEWORK_LOAD": setCurrentCourseworkLoadRatingTypeAggregates,
        "EXAM_DIFFICULTY": setCurrentExamDifficultyRatingTypeAggregates,
        "CONTENT_LOAD": setCurrentContentLoadRatingTypeAggregates,
        "SUPPORT": setCurrentSupportRatingTypeAggregates,
        "LECTURES": setCurrentLecturesRatingTypeAggregates,
        "LECTURE_SPEED": setCurrentLectureSpeedRatingTypeAggregates,
        "FEEDBACK": setCurrentFeedbackRatingTypeAggregates,
        "RESOURCES": setCurrentResourcesRatingTypeAggregates
    }

    // const idToken = currentUser.idToken;

    useEffect(() => {
        
        if (!!moduleContext.moduleCode) {
            updateModuleAggegates(
                null
            );
        }
        else {
            setCurrentModuleAggregates(null);
        }
        
    }, [moduleContext])

    async function updateModuleAggegates(ratingTypes: string[] | null, showLoader: boolean = true): Promise<ApiResponse<ModuleRatingAggregateGetResponseBody> | null> {
        if (!ratingTypes) {
            ratingTypes = API_RATING_TYPES;
        }
        if (showLoader) setLoadingTypes(ratingTypes);
        // if (authorisedUser(currentUser) && moduleContext.moduleData.moduleExists) {
        if (!!moduleContext.moduleCode) {
            const query: ModuleRatingAggregatesQuery = {
                ratingTypes: ratingTypes
            }
            const moduleRatingAggregates: ApiResponse<ModuleRatingAggregateGetResponseBody> = await getModuleRatingAggregates(
                // currentUser.idToken!!,
                moduleContext.moduleCode!!,
                query
            );
            
            const errorResponse = getErrorResponse(moduleRatingAggregates);
            if (!errorResponse) {
                const body = moduleRatingAggregates!!.response!!.body;
                setCurrentModuleAggregates(body.moduleAggregates);
                const ratingTypeAggregates = body.moduleAggregates.ratingTypeAggregates;
                ratingTypes.forEach(ratingType => {
                    let ratingTypeAggregate: RatingTypeAggregates | null = ratingTypeAggregates[ratingType];
                    if (!ratingTypeAggregate) {
                        ratingTypeAggregate = null;
                    }
                    const contextUpdater = ratingTypeStateUpdaterMap[ratingType];
                    if (!!contextUpdater) {
                        contextUpdater(ratingTypeAggregate);
                    }
                });
            }
            else {
                setCurrentModuleAggregates(null);
                ratingTypes.forEach(ratingType => {
                    const contextUpdater = ratingTypeStateUpdaterMap[ratingType];
                    if (!!contextUpdater) {
                        contextUpdater(null);
                    }
                });
            }
            setLoadingTypes([]);
            return moduleRatingAggregates;
        }
        if (showLoader) setLoadingTypes([]);
        return null;
    }

    async function updateModuleAggregate(ratingType: string, showLoader: boolean = true): Promise<ApiResponse<ModuleRatingAggregateGetResponseBody> | null> {
        return updateModuleAggegates([ratingType], showLoader);
    }

    const value =
        <ModuleAggregatesContext.Provider
            value={{moduleAggregates: currentModuleAggregates, updateModuleAggregates: updateModuleAggegates, loadingTypes: loadingTypes}}
        >
            <DifficultyRatingTypeAggregatesContext.Provider
                value={{ratingTypeAggregates: currentDifficultyRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("DIFFICULTY", showLoader)}}
            >
                <ContentRatingTypeAggregatesContext.Provider
                    value={{ratingTypeAggregates: currentContentRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("CONTENT", showLoader)}}
                >
                    <CourseworkLoadRatingTypeAggregatesContext.Provider
                        value={{ratingTypeAggregates: currentCourseworkLoadRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("COURSEWORK_LOAD", showLoader)}}
                    >
                        <ExamDifficultyRatingTypeAggregatesContext.Provider
                            value={{ratingTypeAggregates: currentExamDifficultyRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("EXAM_DIFFICULTY", showLoader)}}
                        >
                            <ContentLoadRatingTypeAggregatesContext.Provider
                                value={{ratingTypeAggregates: currentContentLoadRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("CONTENT_LOAD", showLoader)}}
                            >
                                <SupportRatingTypeAggregatesContext.Provider
                                    value={{ratingTypeAggregates: currentSupportRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("SUPPORT", showLoader)}}
                                >
                                    <LecturesRatingTypeAggregatesContext.Provider
                                        value={{ratingTypeAggregates: currentLecturesRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("LECTURES", showLoader)}}
                                    >
                                        <LectureSpeedRatingTypeAggregatesContext.Provider
                                            value={{ratingTypeAggregates: currentLectureSpeedRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("LECTURE_SPEED", showLoader)}}
                                        >
                                            <FeedbackRatingTypeAggregatesContext.Provider
                                                value={{ratingTypeAggregates: currentFeedbackRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("FEEDBACK", showLoader)}}
                                            >
                                                <ResourcesRatingTypeAggregatesContext.Provider
                                                    value={{ratingTypeAggregates: currentResourcesRatingTypeAggregates, updateRatingTypeAggregates: (showLoader) => updateModuleAggregate("RESOURCES", showLoader)}}
                                                >
                                                    {children}
                                                </ResourcesRatingTypeAggregatesContext.Provider>
                                            </FeedbackRatingTypeAggregatesContext.Provider>
                                        </LectureSpeedRatingTypeAggregatesContext.Provider>
                                    </LecturesRatingTypeAggregatesContext.Provider>
                                </SupportRatingTypeAggregatesContext.Provider>
                            </ContentLoadRatingTypeAggregatesContext.Provider>
                        </ExamDifficultyRatingTypeAggregatesContext.Provider>
                    </CourseworkLoadRatingTypeAggregatesContext.Provider>
                </ContentRatingTypeAggregatesContext.Provider>
            </DifficultyRatingTypeAggregatesContext.Provider>
        </ModuleAggregatesContext.Provider>

    return value;
};