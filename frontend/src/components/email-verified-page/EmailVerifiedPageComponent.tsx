import React, { useContext } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { AuthContext } from '../../services/firebase/AuthStore';
import { LoadingComponent } from '../LoadingComponent';
import { Redirect } from 'react-router';
import { EmailVerifiedComponent } from './EmailVerifiedComponent';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export const EmailVerifiedPageComponent = ({ history }) => {
    return (
        <React.Fragment>
          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="Email successfully verified!" history={history} titleIcon={faCheckCircle} />}>
            <div className="mt-5">
              <EmailVerifiedComponent history={history} />
            </div>
          </MainWrapperComponent>
        </React.Fragment>
      );
}