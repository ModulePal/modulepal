import React, { useState, useContext, useEffect } from "react";
import { AuthContext, authorisedUser } from "../../../services/firebase/AuthStore";
import { ModuleRegistration } from "../../../services/rest/dto/ModuleRegistration";
import { CurrentUserDataContext } from "../../../services/rest/CurrentUserDataStore";
import { SelectedModuleContext } from "../../context/SelectedModuleContext";
import { AcademicYear } from "./ModuleMetadataContext";


interface ModuleMyAcademicDataFunctional {
    myModuleRegistrations: ModuleRegistration[] | null,
    loading: boolean,
    canRateInAcademicYear: (year: AcademicYear | null) => CanRateStatus
}

export const ModuleMyAcademicDataContext = React.createContext<ModuleMyAcademicDataFunctional>({
    myModuleRegistrations: null,
    loading: false,
    canRateInAcademicYear: () => CanRateStatus.CANNOT_RATE_NOT_LOGGED_IN
});

export enum CanRateStatus {
    CAN_RATE,
    CANNOT_RATE_TOOK_MODULE_BUT_NOT_THIS_YEAR,
    CANNOT_RATE_NOT_TOOK_MODULE_IN_ANY_YEAR,
    CANNOT_RATE_NOT_LOGGED_IN
}

export const ModuleMyAcademicDataProvider = ({ children }) => {
    const selectedModuleContext = useContext(SelectedModuleContext);
    const currentUser = useContext(AuthContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);

    const [currentMyModuleRegistrations, setCurrentMyModuleRegistrations] = useState<ModuleRegistration[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const registrations = currentUserDataContext.localData.uniUserModuleRegistrations;
        if (!!registrations && !!selectedModuleContext.module) {
            const allRegistrations = registrations.filter(registration => !!registration.moduleCode && registration.moduleCode === selectedModuleContext.module!!.value);
            setCurrentMyModuleRegistrations(allRegistrations);
        }
        else {
            setCurrentMyModuleRegistrations(null);
        }
        setLoading(false);
    }, [selectedModuleContext, currentUser, currentUserDataContext]);

    function computeCanRate(academicYear: AcademicYear | null): CanRateStatus { // null for all years
        if (!currentUser.isSignedIn) {
            return CanRateStatus.CANNOT_RATE_NOT_LOGGED_IN;
        }
        if (!!currentMyModuleRegistrations) {
            if (currentMyModuleRegistrations.length > 0 && !academicYear) {
                return CanRateStatus.CAN_RATE;
            }
            var found = false;
            currentMyModuleRegistrations.forEach(registration => {
                if (registration.academicYear === academicYear?.raw) {
                    found = true;
                }
            });
            if (found) {
                return CanRateStatus.CAN_RATE;
            }
            if (currentMyModuleRegistrations.length > 0) {
                return CanRateStatus.CANNOT_RATE_TOOK_MODULE_BUT_NOT_THIS_YEAR;
            }
        }
        return CanRateStatus.CANNOT_RATE_NOT_TOOK_MODULE_IN_ANY_YEAR;
    }


    return (
        <ModuleMyAcademicDataContext.Provider
            value={{myModuleRegistrations: currentMyModuleRegistrations, loading: loading, canRateInAcademicYear: computeCanRate}}
        >
            {children}
        </ModuleMyAcademicDataContext.Provider>
    );
};