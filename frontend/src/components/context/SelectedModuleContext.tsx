import React, { useEffect, useState, useContext } from "react";
import { DepartmentSearchData } from "../../services/rest/dto/DepartmentSearchData";
import { ModuleSearchData } from "../../services/rest/dto/ModuleSearchData";
import { ModuleContext } from "../module/context/ModuleContext";

export interface ModuleOption {
    value: string,
    label: string
  }

interface SelectedModuleWithSetter {
    module: ModuleOption | null,
    moduleCode: string | null,
    setModule: (module: ModuleOption | null) => void
}

export const SelectedModuleContext = React.createContext<SelectedModuleWithSetter>({
    module: null,
    moduleCode: null,
    setModule: () => {}
});

export const SelectedModuleProvider = ({ children }) => {
    const [currentModule, setCurrentModule] = useState<ModuleOption | null>(null);
    const moduleCode = !currentModule ? null : currentModule.value;

    return (
        <SelectedModuleContext.Provider
            value={{module: currentModule, setModule: setCurrentModule, moduleCode: moduleCode}}
        >
            {children}
        </SelectedModuleContext.Provider>
    );
};