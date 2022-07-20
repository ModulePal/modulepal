import React, { useContext } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { LoginComponent } from './LoginComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { AuthContext } from '../../services/firebase/AuthStore';
import { LoadingComponent } from '../LoadingComponent';
import { Redirect } from 'react-router';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { LoginAsGuestComponent } from './LoginAsGuestComponent';
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';

export const LoginPageComponent = ({ history, location }) => {
    const currentUser = useContext(AuthContext);

    if (currentUser.pending) {
        return <LoadingComponent />
    }

    if (currentUser.isSignedIn) {
        return <Redirect to="/" />;
    }

    return (
        <React.Fragment>
          
          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="Log in" history={history} titleIcon={faSignInAlt} />}>



            
            <div className="mt-5 login-logout-fields centered">
              <LoginAsGuestComponent history={history} location={location} showDescription={true} />
            </div>
          </MainWrapperComponent>
        </React.Fragment>
      );
}