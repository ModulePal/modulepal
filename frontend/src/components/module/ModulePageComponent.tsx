import React, { useContext, useEffect, useState } from "react";
import { useParams, Redirect } from "react-router";
import { MainWrapperComponent } from "../main-wrapper/MainWrapperComponent";
import { AuthContext } from "../../services/firebase/AuthStore";
import { LoadingComponent } from "../LoadingComponent";
import { ModuleBasicDataResponseBody } from "../../services/rest/responses/body/ModuleBasicDataResponseBody";
import { ModuleBasicData } from "../../services/rest/dto/ModuleBasicData";
import { ModuleNotExistsComponent } from "./ModuleNotExistsComponent";
import { ModuleReviewsComponent } from "./ModuleReviewsComponent";
import { ModuleContext } from "./context/ModuleContext";
import { ModuleComponent } from "../reviews-page/ModuleComponent";
import { SelectedModuleContext } from "../context/SelectedModuleContext";
import { TitleBannerComponent } from "../banner/TitleBannerComponent";
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'

export const ModulePageComponent = ({ history }) => {
    const moduleContext = useContext(ModuleContext);
    const currentUser = useContext(AuthContext);

    let moduleCode = moduleContext.moduleData.module;

    useEffect(() => {
        // if (currentUser.user && currentUser.isSignedIn && idToken && currentUser.user.emailVerified) {
        if (!!moduleCode) moduleContext.updateModuleData(moduleCode);
        // }
    }, []);

    if (currentUser.pending) {
        return <LoadingComponent />
    }

    // if (!currentUser.isSignedIn || !currentUser.user || !currentUser.user.emailVerified || !currentUser.idToken) {
    //     return <Redirect exact to="/" />
    // }


    return (
        <React.Fragment>
            <MainWrapperComponent top={null} history={history} banner={<TitleBannerComponent titleString={moduleCode + " Reviews"} history={history} titleIcon={faBookOpen} />}>
                <ModuleReviewsComponent history={history} />
            </MainWrapperComponent>
        </React.Fragment>
    );
}