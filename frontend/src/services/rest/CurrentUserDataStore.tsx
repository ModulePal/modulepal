import React, { useEffect, useState, useContext } from "react";
import { UniUserBasicData } from "./dto/UniUserBasicData";
import { UserBasicData } from "./dto/UserBasicData";
import { getPrimaryUniUserModuleRegistrations, getUserPrimaryUniUserBasicData } from "./api";
import { UserPrimaryUniUserBasicDataResponse } from "./responses/UserPrimaryUniUserBasicDataResponse";
import { UserPrimaryUniUserBasicDataResponseBody } from "./responses/body/UserPrimaryUniUserBasicDataResponseBody";
import { ApiResponse } from "./ApiResponse";
import { Response } from "./responses/Response";
import { useComponentsPure } from "react-select-async-paginate/ts/useComponents";
import { ModuleRegistration } from "./dto/ModuleRegistration";
import { GetPrimaryUniUserModuleRegistrationsResponseBody } from "./responses/body/GetPrimaryUniUserModuleRegistrationsResponseBody";
import { dateDiffFriendly } from "../helper/time-helper";
import { bool } from "prop-types";

const fullReplaceWindowMs = 1800000;

interface LocalUniUserData {
    queriedUniUserBasicData: boolean,
    queriedUniUserModuleRegistrations: boolean,
    uniUserBasicData: UniUserBasicData | null,
    uniUserModuleRegistrations: ModuleRegistration[] | null,
    lastQueryTimestamp: number | null
}

export interface CurrentRestUser {
    // userBasicData: UserBasicData | null,
    localData: LocalUniUserData,
    loadingUniUserData: boolean,
    // updateUserBasicData: (idToken: string, replace: boolean) => void,
    updateUniUserLocalData: (idToken: string, replace: boolean) => Promise<void>,
    voidUniUserLocalData: (queried: boolean) => Promise<void>,
    modifyModuleReviewsCount: (increment: boolean, moduleCode: string, academicYear: string, idToken: string) => Promise<void>,
    updateAnonymous: (newAnonymous: boolean) => Promise<void>,
    // voidUserBasicData: () => void
    cursed: boolean, // EASTER EGG FOR LAMBDA CURSE
    setCursed: (newCursed: boolean) => void // EASER EGG FOR LAMBDA CURSE
}

export const CurrentUserDataContext = React.createContext<CurrentRestUser>({
    localData: {
        queriedUniUserBasicData: false,
        queriedUniUserModuleRegistrations: false,
        uniUserBasicData: null,
        uniUserModuleRegistrations: null,
        lastQueryTimestamp: null
    },
    loadingUniUserData: false,
    // userBasicData: null,
    updateUniUserLocalData: async () => {},
    voidUniUserLocalData: async () => {},
    modifyModuleReviewsCount: async () => {},
    updateAnonymous: async () => {},
    // updateUserBasicData: () => {},
    // voidUserBasicData: () => {}
    cursed: false, // EASER EGG FOR LAMBDA CURSE
    setCursed: () => {} // EASER EGG FOR LAMBDA CURSE
});

const localStorageUniUserBasicDataPath = 'LocalUniUserData';

export const CurrentUserDataProvider = ({ children }) => {
    const [fullReplaceTimeout, setFullReplaceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [loadingUniUserData, setLoadingUniUserData] = useState(false);
    const [cursed, setCursedState] = useState(window.localStorage.getItem("cursed") === "true");

    function setCursed(newCursed: boolean) {
        window.localStorage.setItem("cursed", JSON.stringify(newCursed));
        setCursedState(newCursed);
    }

    const localUniUserBasicData = window.localStorage.getItem(localStorageUniUserBasicDataPath);
    const defaultUniUserBasicData: LocalUniUserData = !!localUniUserBasicData ? JSON.parse(localUniUserBasicData) : {
        queriedUniUserBasicData: false,
        queriedUniUserModuleRegistrations: false,
        uniUserBasicData: null,
        uniUserModuleRegistrations: null,
        lastQueryTimestamp: null
    };

    const [currentLocalData, setCurrentLocalData] = useState<LocalUniUserData>(defaultUniUserBasicData);

    function updateLocalCurrentUniUserData(data: LocalUniUserData) {
        window.localStorage.setItem(localStorageUniUserBasicDataPath, JSON.stringify(data));
        setCurrentLocalData(JSON.parse(JSON.stringify(data)));
    }

    // const [currentUserBasicData, setCurrentUserBasicData] = useState<UserBasicData | null>(null);

    async function voidUniUserLocalData(queried: boolean) {
        updateLocalCurrentUniUserData({
            queriedUniUserBasicData: queried,
            queriedUniUserModuleRegistrations: queried,
            uniUserBasicData: null,
            uniUserModuleRegistrations: null,
            lastQueryTimestamp: null
        });
    }

    function fullRefresh(): boolean {
        const lastQueryTimestamp = currentLocalData.lastQueryTimestamp;
        if (!lastQueryTimestamp) return true;
        const earliestTimeForLastQueryTimestamp = new Date().getTime() - fullReplaceWindowMs;
        return lastQueryTimestamp < earliestTimeForLastQueryTimestamp;
    }

    async function updateUniUserLocalData(idToken: string, replace: boolean) {
        const fullReplace = fullRefresh();
        if (fullReplace) {
            replace = true;
        }

        if (!replace && currentLocalData.queriedUniUserBasicData && currentLocalData.queriedUniUserModuleRegistrations) {
            return; // don't want to replace and already have so do nothing
        }

        setLoadingUniUserData(true);

        var newLocalUniUserData: LocalUniUserData = {
            queriedUniUserBasicData: currentLocalData.queriedUniUserBasicData,
            queriedUniUserModuleRegistrations: currentLocalData.queriedUniUserModuleRegistrations,
            uniUserBasicData: currentLocalData.queriedUniUserBasicData ? JSON.parse(JSON.stringify(currentLocalData.uniUserBasicData)) : null,
            uniUserModuleRegistrations: currentLocalData.queriedUniUserModuleRegistrations ? JSON.parse(JSON.stringify(currentLocalData.uniUserModuleRegistrations)) : null,
            lastQueryTimestamp: fullReplace ? new Date().getTime() : currentLocalData.lastQueryTimestamp
        };
        
        if (replace || !currentLocalData.queriedUniUserBasicData) {
            let userPrimaryUniUserBasicDataResponse: ApiResponse<UserPrimaryUniUserBasicDataResponseBody> = await getUserPrimaryUniUserBasicData(idToken);
            if (!!userPrimaryUniUserBasicDataResponse && !userPrimaryUniUserBasicDataResponse.error) {
                const apiResponse: Response<UserPrimaryUniUserBasicDataResponseBody> | null = userPrimaryUniUserBasicDataResponse.response;
                if (!!apiResponse && !apiResponse.error && apiResponse.success) {
                    const uniUserBasicData: UniUserBasicData | null = apiResponse.body.uniUserBasicData;
                    newLocalUniUserData.queriedUniUserBasicData = true;
                    newLocalUniUserData.uniUserBasicData = uniUserBasicData;
                }
                else if (!!apiResponse && !!apiResponse.error && (apiResponse.error === 4 || apiResponse.error === 2)) {
                    newLocalUniUserData.queriedUniUserBasicData = true;
                    newLocalUniUserData.uniUserBasicData = null;
                }
            }
        }
        if (replace || !currentLocalData.queriedUniUserModuleRegistrations) {
            let userPrimaryUniUserModuleRegistrationsResponse: ApiResponse<GetPrimaryUniUserModuleRegistrationsResponseBody> = await getPrimaryUniUserModuleRegistrations(idToken, null);
            if (!!userPrimaryUniUserModuleRegistrationsResponse && !userPrimaryUniUserModuleRegistrationsResponse.error) {
                const apiResponse: Response<GetPrimaryUniUserModuleRegistrationsResponseBody> | null = userPrimaryUniUserModuleRegistrationsResponse.response;
                if (!!apiResponse && !apiResponse.error && apiResponse.success) {
                    const moduleRegistrations: ModuleRegistration[] | null = apiResponse.body.moduleRegistrations;
                    newLocalUniUserData.queriedUniUserModuleRegistrations = true;
                    newLocalUniUserData.uniUserModuleRegistrations = moduleRegistrations;
                }
                else if (!!apiResponse && !!apiResponse.error && (apiResponse.error === 4 || apiResponse.error === 2)) {
                    newLocalUniUserData.queriedUniUserModuleRegistrations = true;
                    newLocalUniUserData.uniUserModuleRegistrations = null;
                }
            }
        }

        updateLocalCurrentUniUserData(newLocalUniUserData);

        // if a full replace happened then schedule another
        setFullReplaceTimeout(
            fullReplace && !fullReplaceTimeout ? 
                setTimeout(async () => {await updateUniUserLocalData(idToken, false); setFullReplaceTimeout(null)}, fullReplaceWindowMs + 2000)
            :
            fullReplaceTimeout
        );

        setLoadingUniUserData(false);
    }

    async function modifyModuleReviewsCount(increment: boolean, moduleCode: string, academicYear: string, idToken: string) {
        if (fullRefresh()) {
            await updateUniUserLocalData(idToken, true);
            return;
        }
        // try basic increment first, otherwise raw update
        if (currentLocalData.uniUserModuleRegistrations != null) {
            const registrations: ModuleRegistration[] = JSON.parse(JSON.stringify(currentLocalData.uniUserModuleRegistrations));
            const regIndex = registrations.findIndex(moduleRegistration => !!moduleRegistration.moduleCode && moduleRegistration.moduleCode === moduleCode && !!moduleRegistration.academicYear && moduleRegistration.academicYear === academicYear);
            if (regIndex != -1 && registrations[regIndex].numReviews != null) {
                registrations[regIndex].numReviews = registrations[regIndex].numReviews + (increment ? 1 : -1);
                const newLocalUniUserData: LocalUniUserData = {
                    queriedUniUserBasicData: currentLocalData.queriedUniUserBasicData,
                    queriedUniUserModuleRegistrations: currentLocalData.queriedUniUserModuleRegistrations,
                    uniUserBasicData: JSON.parse(JSON.stringify(currentLocalData.uniUserBasicData)),
                    uniUserModuleRegistrations: registrations,
                    lastQueryTimestamp: currentLocalData.lastQueryTimestamp
                }
                updateLocalCurrentUniUserData(newLocalUniUserData);
                return;
            }
        }
        // couldn't do it locally, so force update their data since a weird thing happened
        await updateUniUserLocalData(idToken, true);
    }

    async function updateAnonymous(newAnonymous: boolean) {
        if (currentLocalData.uniUserBasicData != null) {
            var newUniUserBasicData: UniUserBasicData = JSON.parse(JSON.stringify(currentLocalData.uniUserBasicData));
            newUniUserBasicData.anonymous = newAnonymous;

            const newLocalUniUserData: LocalUniUserData = {
                queriedUniUserBasicData: currentLocalData.queriedUniUserBasicData,
                queriedUniUserModuleRegistrations: currentLocalData.queriedUniUserModuleRegistrations,
                uniUserBasicData: newUniUserBasicData,
                uniUserModuleRegistrations: JSON.parse(JSON.stringify(currentLocalData.uniUserModuleRegistrations)),
                lastQueryTimestamp: currentLocalData.lastQueryTimestamp
            }

            updateLocalCurrentUniUserData(newLocalUniUserData);
        }
    }
    
    // EASER EGG FOR LAMBDA CURSE
    return (
        <CurrentUserDataContext.Provider
            value={{localData: currentLocalData, updateUniUserLocalData: updateUniUserLocalData, voidUniUserLocalData: voidUniUserLocalData, modifyModuleReviewsCount: modifyModuleReviewsCount, updateAnonymous: updateAnonymous, loadingUniUserData: loadingUniUserData, cursed, setCursed }}
        > 
            {children}
        </CurrentUserDataContext.Provider>
    );
};