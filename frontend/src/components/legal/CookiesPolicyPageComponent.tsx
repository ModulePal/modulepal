import React, { useState } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { BannerComponent } from '../banner/BannerComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons'
import { CookiesPolicyComponent } from './CookiesPolicyComponent';

export const CookiesPolicyPageComponent = ({ history }) => {
    return (
        <React.Fragment>
          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="Cookie Preferences" history={history} titleIcon={faCookieBite} />}>
             <div className="mt-5">
              <CookiesPolicyComponent />
              </div>
          </MainWrapperComponent>

        </React.Fragment>
      );
}
