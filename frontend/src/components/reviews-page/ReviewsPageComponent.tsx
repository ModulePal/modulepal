import React, { useContext, useState, useEffect } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { AuthContext } from '../../services/firebase/AuthStore';
import { Col, Row, Container, Tooltip } from 'reactstrap';
import { ModulesSearchComponent } from './ModulesSearchComponent';
import { DepartmentsSearchComponent } from './DepartmentsSearchComponent';
import { SelectedDepartmentProvider } from '../context/SelectedDepartmentContext';
import { ModuleComponent } from './ModuleComponent';
import { SelectedModuleProvider, SelectedModuleContext } from '../context/SelectedModuleContext';
import { ModuleProvider } from '../module/context/ModuleContext';
import { BannerComponent } from '../banner/BannerComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faComments, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export const ReviewsPageComponent = ({ history }) => {
    const [descTooltipOpen, setDescTooltipOpen] = useState(false);

    const banner=
      <BannerComponent page="reviews" history={history}>
      <span><h1 className="display-4 mb-4"><FontAwesomeIcon icon={faComments} size="1x"/> Reviews</h1></span>
      {/* <Tooltip
          placement="right"
          isOpen={descTooltipOpen}
          target={"reviews-desc"}
          toggle={() => setDescTooltipOpen(!descTooltipOpen)}
          autohide={false}
      >
          Review counts are updated at the start of every hour.
      </Tooltip> */}
      <Container className="reviews-page-search-max-width mt-5">
        <div className="centered">
        <div className="mb-3">
        <ModulesSearchComponent history={history} redirect={false}/>
        </div>
        </div>
      </Container>
      {/* <Row>
        <ModuleComponent history={history} />
      </Row> */}
</BannerComponent>
    return (
        <React.Fragment>
          {/* <SelectedDepartmentProvider>
          <SelectedModuleProvider> */}
          {/* <ModuleProvider> */}


            <MainWrapperComponent top={null} history={history} banner={banner}>
              <Row>
                <ModuleComponent history={history} />
              </Row>
            </MainWrapperComponent>
          {/* </ModuleProvider> */}
          {/* </SelectedModuleProvider>
          </SelectedDepartmentProvider> */}
        </React.Fragment>
      );
}
