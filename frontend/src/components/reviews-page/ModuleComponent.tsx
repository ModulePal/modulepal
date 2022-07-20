import React, { useState, useContext } from 'react';
import { AuthContext } from '../../services/firebase/AuthStore';
import { SelectedModuleContext } from '../context/SelectedModuleContext';
import { ModuleRatingsComponent } from './ModuleRatingsComponent';
import { ModuleCommentsComponent } from './ModuleCommentsComponent';
import { ModuleReviewsComponent } from '../module/ModuleReviewsComponent';

export const ModuleComponent = ({ history }) => {
    const authContext = useContext(AuthContext);

    const currentModule = useContext(SelectedModuleContext);

    return (
        <React.Fragment>
            <ModuleReviewsComponent history={history} />
        </React.Fragment>
      );
}