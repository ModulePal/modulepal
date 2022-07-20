import React, { useState } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { BannerComponent } from '../banner/BannerComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { AboutComponent } from './AboutComponent';

export const AboutPageComponent = ({ history }) => {
    return (
        <React.Fragment>
          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="About" history={history} titleIcon={faInfoCircle} />}>
             <div className="mt-5 mb-5">
                 <AboutComponent />
              </div>
          </MainWrapperComponent>

        </React.Fragment>
      );
}
