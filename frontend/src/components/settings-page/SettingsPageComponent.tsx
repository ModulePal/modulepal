import React, { useState } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { SettingsComponent } from './SettingsComponent';
import { BannerComponent } from '../banner/BannerComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { faCogs, faUser } from '@fortawesome/free-solid-svg-icons'

export const SettingsPageComponent = ({ history, location }) => {
    return (
        <React.Fragment>


          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="My Account" history={history} titleIcon={faUser} />}>
             <div className="mt-5">
              <SettingsComponent history={history} location={location} />
              </div>
          </MainWrapperComponent>

        </React.Fragment>
      );
}
