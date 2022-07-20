import React, { useEffect, useState, useContext } from "react";
import { ModuleBasicData } from "../../../services/rest/dto/ModuleBasicData";
import { ModuleBasicDataResponseBody } from "../../../services/rest/responses/body/ModuleBasicDataResponseBody";
import { ApiResponse } from "../../../services/rest/ApiResponse";
//import { getModuleBasicData } from "../../../services/rest/api";
import { SelectedModuleContext } from "../../context/SelectedModuleContext";
import { ModuleAggregatesProvider } from "./ModuleAggregatesContext";
import { ModuleMetadataProvider } from "./ModuleMetadataContext";
import { ModuleCommentsProvider } from "./ModuleCommentsContext";
import { ModuleMyRatingsProvider } from "./ModuleMyRatingsContext";
import { ModuleMyAcademicDataContext, ModuleMyAcademicDataProvider } from "./ModuleMyAcademicDataContext";
import { RatingTypesFilterProvider } from "./RatingTypesFilterContext";
import { AuthContext } from "../../../services/firebase/AuthStore";
import { BulkAddReviewsProvider } from "./BulkAddReviewsContext";
import { ModuleSuggestionsProvider } from "./ModuleSuggestionsContext";

interface ModuleData {
    module: string | null,
    moduleExists: boolean
}

interface ModuleDataFunctional {
    moduleData: ModuleData,
    updateModuleData: (moduleCode: string) => void
}

export const ModuleContext = React.createContext<ModuleDataFunctional>({
    moduleData: {
        module: null,
        moduleExists: false
    },
    updateModuleData: () => {}
});

export const ModuleProvider = ({ children }) => {
    const [currentModuleData, setCurrentModuleData] = useState<ModuleData>({
        module: null,
        moduleExists: false
    });

    function updateModuleData(moduleCode: string) {
        setCurrentModuleData({
            module: moduleCode,
            moduleExists: true
        });
    }

    const value =
        <ModuleContext.Provider
                value={{moduleData: currentModuleData, updateModuleData: updateModuleData}}
            >
            <ModuleMetadataProvider>
                <RatingTypesFilterProvider>
                    {/* <BulkAddReviewsProvider> */}
                        <ModuleMyAcademicDataProvider>
                            <ModuleMyRatingsProvider>
                                <ModuleCommentsProvider>
                                    <ModuleSuggestionsProvider>
                                        <ModuleAggregatesProvider>
                                        
                                            {children}
                                        
                                        </ModuleAggregatesProvider>
                                    </ModuleSuggestionsProvider>
                                </ModuleCommentsProvider>
                            </ModuleMyRatingsProvider>
                        </ModuleMyAcademicDataProvider>
                    {/* </BulkAddReviewsProvider> */}
                </RatingTypesFilterProvider>
            </ModuleMetadataProvider>
        </ModuleContext.Provider>
        
    return value;
};