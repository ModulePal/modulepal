import React, { useState } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { BannerComponent } from '../banner/BannerComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { PrivacyPolicyComponent } from './PrivacyPolicyComponent';

export const PrivacyPolicyPageComponent = ({ history }) => {
    return (
        <React.Fragment>
          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="Privacy Policy" history={history} titleIcon={faShieldAlt} />}>
             <div className="mt-5">
              <PrivacyPolicyComponent history={history} />
              </div>
          </MainWrapperComponent>

        </React.Fragment>
      );
}
