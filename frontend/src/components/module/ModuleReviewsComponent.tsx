import React, { useContext } from "react";
import { ModuleBasicData } from "../../services/rest/dto/ModuleBasicData";
import { SelectedModuleContext } from "../context/SelectedModuleContext";
import { ModuleContext } from "./context/ModuleContext";
import { ModuleNotExistsComponent } from "./ModuleNotExistsComponent";
import { ModuleViewComponent } from "./ModuleViewComponent";



export const ModuleReviewsComponent = ({ history }) => {
    const moduleContext = useContext(SelectedModuleContext);

    return (
        <React.Fragment>
            {!!moduleContext.moduleCode ? <ModuleViewComponent /> : <ModuleNotExistsComponent /> }
        </React.Fragment>
    );
}