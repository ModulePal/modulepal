import React, { useState, useContext, useEffect } from "react";
import { ApiResponse } from "../../../services/rest/ApiResponse";
import { ModuleBasicDataResponseBody } from "../../../services/rest/responses/body/ModuleBasicDataResponseBody";
import { getModuleAcademicYearRange, getModuleMetadata } from "../../../services/rest/api";
import { ModuleRatingAcademicYearRangeResponseBody } from "../../../services/rest/responses/body/ModuleRatingAcademicYearRangeResponseBody";
import { ModuleContext } from "./ModuleContext";
import { AuthContext, authorisedUser } from "../../../services/firebase/AuthStore";
import { getErrorResponse } from "../../../services/rest/error";
import { SelectedModuleContext } from "../../context/SelectedModuleContext";
import { ModuleBasicData } from "../../../services/rest/dto/ModuleBasicData";
import { ModuleLeader } from "../../../services/rest/dto/ModuleLeader";
import { ModuleMetadataResponseBody } from "../../../services/rest/responses/body/ModuleMetadataResponseBody";
import { isNullOrUndefined } from "util";


export interface AcademicYear {
    start: number,
    end: number,
    raw: string,
    display: string
}

export function parseAcademicYear(apiString: string): AcademicYear | null {
    const start: Number = Number(apiString.substring(0, 2));
    const end: Number = Number(apiString.substring(3, 5));
    if (!start || !end) {
        return null;
    }
    else {
        const display: string = (2000 + start.valueOf()) + "-" + (2000 + end.valueOf());
        return {
            start: start.valueOf(),
            end: end.valueOf(),
            raw: apiString,
            display: display
        };
    }
}

interface ModuleMetadataFunctional {
    basicData: ModuleBasicData | null,
    academicYears: AcademicYear[] | null,
    leaders: ModuleLeader[] | null,
    updateMetadata: (onlyAcademicYears: boolean) => Promise<ApiResponse<ModuleMetadataResponseBody> | null>,
    loadingBasicData: boolean
}

export const ModuleMetadataContext = React.createContext<ModuleMetadataFunctional>({
    basicData: null,
    academicYears: null,
    leaders: null,
    updateMetadata: async () => null,
    loadingBasicData: false
});

export const ModuleMetadataProvider = ({ children }) => {
    const moduleContext = useContext(SelectedModuleContext);

    const [currentBasicData, setCurrentBasicData] = useState<ModuleBasicData | null>(null);
    const [currentModuleLeaders, setCurrentModuleLeaders] = useState<ModuleLeader[] | null>(null);
    const [currentAcademicYears, setCurrentAcademicYears] = useState<AcademicYear[] | null>(null);
    const [loadingBasicData, setLoadingBasicData] = useState<boolean>(false);

    useEffect(() => {
        if (!!moduleContext.moduleCode) {
            updateMetadata(
                moduleContext.moduleCode
            );
        }
        else {
            setCurrentAcademicYears(null);
        }
    }, [moduleContext])

    async function updateMetadataInCurrentState(onlyAcademicYears: boolean = false): Promise<ApiResponse<ModuleMetadataResponseBody> | null> {
        return updateMetadata(moduleContext.moduleCode!!, onlyAcademicYears);
    }

    async function updateMetadata(moduleCode: string, onlyAcademicYears: boolean = false): Promise<ApiResponse<ModuleMetadataResponseBody>> {
        const includeBasicData = !onlyAcademicYears;
        const includeAcademicYears = true;
        const includeLeaders = !onlyAcademicYears;
        const includeNumReviews = !onlyAcademicYears;
        if (includeBasicData) {
            setLoadingBasicData(true);
        }
        const metadataResponse = await getModuleMetadata(moduleCode, includeBasicData, includeAcademicYears, includeLeaders, includeNumReviews);
        const errorResponse = getErrorResponse(metadataResponse);
        if (!errorResponse) {
            const body = metadataResponse.response!!.body;
            const newAcademicYears: AcademicYear[] = [];
            body.academicYears.forEach(academicYearString => {
                const academicYear: AcademicYear | null = parseAcademicYear(academicYearString);
                if (!academicYear) {
                    return;
                }
                else {
                    newAcademicYears.push(academicYear);
                }
            });
            const newBasicData = body.moduleBasicData;
            const newLeaders = body.leaders;
            if (includeBasicData && JSON.stringify(currentBasicData) !== JSON.stringify(newBasicData)) {
                setCurrentBasicData(newBasicData);
            }
            if (includeLeaders && JSON.stringify(currentModuleLeaders) !== JSON.stringify(newLeaders)) {
                setCurrentModuleLeaders(newLeaders);
            }
            if (includeAcademicYears && JSON.stringify(currentAcademicYears) !== JSON.stringify(newAcademicYears)) {
                setCurrentAcademicYears(newAcademicYears);
            }
        }
        if (includeBasicData) {
            setLoadingBasicData(false);
        }
        return metadataResponse;
    }

    var academicYearsJoinedWithLeaders = !currentModuleLeaders ? [] : currentModuleLeaders.map(l => parseAcademicYear(l.academicYear)!!);
    if (!!currentAcademicYears) {
        currentAcademicYears.forEach(academicYear => {
            if (!academicYearsJoinedWithLeaders.some(y => y.raw === academicYear.raw)) {
                academicYearsJoinedWithLeaders.push(academicYear);
            }
        });
    }
    academicYearsJoinedWithLeaders.sort((y1, y2) => y1.start - y2.start);

    return (
        <ModuleMetadataContext.Provider
            value={{basicData: currentBasicData, leaders: currentModuleLeaders, academicYears: academicYearsJoinedWithLeaders, updateMetadata: updateMetadataInCurrentState, loadingBasicData: loadingBasicData}}
        >
            {children}
        </ModuleMetadataContext.Provider>
    );
};