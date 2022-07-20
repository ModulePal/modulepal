import React, { useState, useContext, useEffect } from 'react';
import { LoggedInComponent } from './LoggedInComponent';
import { NotLoggedInComponent } from './NotLoggedInComponent';
import { LoadingComponent } from '../LoadingComponent';
import { AuthContext } from '../../services/firebase/AuthStore';
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';

export const AuthComponent = ({ history, displayUniUserPreview }) => {
    // const restStoreContext = useContext(RestStoreContext);
    // const globalData = restStoreContext.globalData;
    // const loggedInUser = globalData.loggedInUser;
  
    const authContext = useContext(AuthContext);

    if (authContext.pending) {
      return <LoadingComponent />
    }

    return (
            !authContext.isSignedIn ? <NotLoggedInComponent history={history}></NotLoggedInComponent> : <LoggedInComponent history={history} currentUser={authContext.user} displayUniUserPreview={displayUniUserPreview} anonymous={authContext.anonymous}></LoggedInComponent>
      );
}