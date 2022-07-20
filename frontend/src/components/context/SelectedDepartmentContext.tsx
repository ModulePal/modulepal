import React, { useEffect, useState, useContext } from "react";
import { DepartmentSearchData } from "../../services/rest/dto/DepartmentSearchData";

export interface DepartmentOption {
    value: String,
    label: String
}

interface SelectedDepartmentWithSetter {
    department: DepartmentOption | null,
    setDepartment: (department: DepartmentOption | null) => void
}

export const SelectedDepartmentContext = React.createContext<SelectedDepartmentWithSetter>({
    department: null,
    setDepartment: () => {}
});

export const SelectedDepartmentProvider = ({ children }) => {
    const [currentDepartment, setCurrentDepartment] = useState<DepartmentOption | null>(null);

    return (
        <SelectedDepartmentContext.Provider
            value={{department: currentDepartment, setDepartment: setCurrentDepartment}}
        >
            {children}
        </SelectedDepartmentContext.Provider>
    );
};