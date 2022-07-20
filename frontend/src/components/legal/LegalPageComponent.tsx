import React, { useState } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { BannerComponent } from '../banner/BannerComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { faScroll } from '@fortawesome/free-solid-svg-icons'
import { LegalComponent } from './LegalComponent';

export const LegalPageComponent = ({ history }) => {
    return (
        <React.Fragment>
          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="Legal" history={history} titleIcon={faScroll} />}>
             <div className="mt-5">
              <LegalComponent history={history} />
              </div>
          </MainWrapperComponent>

        </React.Fragment>
      );
}
