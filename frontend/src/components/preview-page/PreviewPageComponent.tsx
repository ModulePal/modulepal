import React, { useState } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { BannerComponent } from '../banner/BannerComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { faEye, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { LandingPanelsComponent } from '../panels/LandingPanelsComponent';

export const PreviewPageComponent = ({ history }) => {
    return (
        <React.Fragment>
          <MainWrapperComponent top={null} history={history} banner={<TitleBannerComponent titleString="Preview" history={history} titleIcon={faEye} />}>
             <div className="mt-5">
                 <LandingPanelsComponent/>
              </div>
          </MainWrapperComponent>

        </React.Fragment>
      );
}
