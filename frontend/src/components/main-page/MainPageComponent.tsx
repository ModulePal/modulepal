import React, { useContext, useState, useEffect } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { Jumbotron, Button, Alert, Card, Row, Col, Container, Toast, ToastHeader, ToastBody, Spinner, Tooltip } from 'reactstrap';
import { LoadingComponent } from '../LoadingComponent';
import { AuthContext } from '../../services/firebase/AuthStore';
import { UniUserBasicData } from '../../services/rest/dto/UniUserBasicData';
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';
import { BannerComponent } from '../banner/BannerComponent';
import logolarge from '../../img/logo-large.png';
import { LoginComponent } from '../login-page/LoginComponent';
import { LoginAsGuestComponent } from '../login-page/LoginAsGuestComponent';
import { SignupComponent } from '../signup-page/SignupComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faChartPie, faComments, faEye, faKiss, faReplyAll, faSignInAlt, faUser, faUserCheck, faUserClock, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { DepartmentsSearchComponent } from '../reviews-page/DepartmentsSearchComponent';
import { ModulesSearchComponent } from '../reviews-page/ModulesSearchComponent';
import { SelectedDepartmentProvider } from '../context/SelectedDepartmentContext';
import { SelectedModuleProvider } from '../context/SelectedModuleContext';
import { ModuleProvider } from '../module/context/ModuleContext';
import { ModuleComponent } from '../reviews-page/ModuleComponent';
import { VerifyEmailComponent } from '../settings-page/VerifyEmailComponent';
import { VerifyUniStatusComponent } from '../shared/VerifyUniStatusComponent';
import ratingImg from '../../img/Rating.png'
import { LandingPanelsComponent } from '../panels/LandingPanelsComponent';
import { UniUserMyReviewsComponent } from '../main-wrapper/UniUserMyReviewsComponent';
import { PanelComponent } from '../panels/PanelComponent';
import { Redirect } from 'react-router';

export const MainPageComponent = ({ history, location }) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [logInAsStaffTooltipOpen, setLogInAsStaffTooltipOpen] = useState(false);
    const [redirectToPreview, setRedirectToPreview] = useState(false);

    useEffect(() => {
        window.addEventListener('resize', handleWidthChange);
        return () => window.removeEventListener('resize', handleWidthChange);
    })

    function handleWidthChange() {
        setWidth(window.innerWidth);
    }

    const smallBanner = width <= 1000;

    const authContext = useContext(AuthContext);
    const currentUserData = useContext(CurrentUserDataContext);

    if (authContext.pending) {
      return <LoadingComponent />
    }

    if (redirectToPreview) {
      return <Redirect to="/preview"></Redirect>
    }

    const emailVerified = authContext.isSignedIn && authContext.user?.emailVerified;
    const anonymous = authContext.isSignedIn && authContext.anonymous;

    const uniUserBasicData: UniUserBasicData | null = currentUserData.localData.uniUserBasicData;
    const uniAccountVerified = !!uniUserBasicData && !!uniUserBasicData.gotModuleData && uniUserBasicData.gotModuleData;

    const loggedIn = authContext.isSignedIn;

    const gotNoModules = !currentUserData.localData.uniUserModuleRegistrations || currentUserData.localData.uniUserModuleRegistrations.length === 0;

    const alerts =
      <React.Fragment>
        {/* <Alert hidden={!!emailVerified || !loggedIn} color="warning" className="text-center w-100">
          Please verify your email to read reviews.
        </Alert>
        <Alert hidden={(uniAccountVerified && emailVerified) || !emailVerified} color="warning" className="text-center w-100">
            Please verify your student status to post reviews.
        </Alert>
        <Alert hidden={!!loggedIn} color="info" className="text-center w-100">
          Please log in and verify your email to access reviews.
        </Alert> */}
      </React.Fragment>;

    const top = <React.Fragment>
      <Container>
      <Row>
        <Container className="mt-1 mb-1">
          <img src={logolarge} className="logo-large centered img_mobile noselect"></img>
        </Container>
      </Row>
      <Row>
        {alerts}
      </Row>
      </Container>
    </React.Fragment>;

    // const seeReviewsAction = <Button className="centered mt-3 mb-3 btn-lg see-reviews-button font-size-21" color="outline-light" onClick={() => history.push("/reviews")}><FontAwesomeIcon icon={faBookOpen} size="sm" />&nbsp; See Reviews</Button>;
    // const verifyEmailAction = <Button className="centered mt-3 mb-3 btn-lg" color="outline-light">Verify Email</Button>;

    const depSearch = <DepartmentsSearchComponent />
    const moduleSearch = <ModulesSearchComponent history={history} redirect={true} />

    const lead = <React.Fragment>
      <Container className="no-pad no-margin">
        <div className="mb-3-only">
          {moduleSearch}
        </div>
      </Container>
      
    </React.Fragment>;

    const seeReviewsView = <Container className="no-pad">
                            <UniUserMyReviewsComponent linkClickCallback={() => {}}></UniUserMyReviewsComponent>
                            {/* <img src={ratingImg} className="main-page-login-card centered" /> */}
                          </Container>;




    // const verifyEmailView = <Container className="centered text-center"><Button className="centered mt-3 mb-3" color="warning">Verify Email</Button></Container>
    const verifyEmailView = <Container className="centered text-center body-color"><VerifyEmailComponent history={history} /></Container>
    // const seeReviewsView = null;
    // const verifyEmailView = null;

    const linkStudentAccountView = <Container className="centered text-center body-color"><VerifyUniStatusComponent showCard={true} location={location} showDescription={true} /></Container>

    const notLoggedInView =
        <React.Fragment>
          <Toast className="dashboard-list-pad bg-white body-color large-rounded-buttons">
            <div className="toast-heading-padding"><span className="font-size-18"><strong><FontAwesomeIcon icon={faComments} size="lg" />&nbsp; Want to say something?</strong></span></div>
            <div className="mb-3"><LoginAsGuestComponent history={history} location={location} showDescription={false} /></div>
            <hr className="no-pad no-margin mt-2"></hr>
            <div className="mt-2">
                  <div className="toast-heading-padding"><span className="font-size-18"><strong><FontAwesomeIcon icon={faReplyAll} size="lg" />&nbsp; Want to respond to your students?</strong></span></div>
                  <div className="text-center">
                    <Container>
                  <div className="mt-3 mb-2 wrap" id="log-in-as-staff-btn">
                    <Button color="primary" disabled><FontAwesomeIcon icon={faSignInAlt} size="1x" />&nbsp; Log in as staff</Button>
                    <Tooltip
                        placement="top"
                        isOpen={logInAsStaffTooltipOpen}
                        target={"log-in-as-staff-btn"}
                        toggle={() => setLogInAsStaffTooltipOpen(!logInAsStaffTooltipOpen)}
                        // autohide={false}
                    >
                        Coming soon!
                    </Tooltip>
                    
                    </div>
                    </Container>
                    </div>
            </div>
          </Toast>
          
    </React.Fragment>
          {/* <Toast className={"dashboard-list-pad bg-white mt-2"}>
              <ToastHeader className="no-border-bottom no-pad-bottom">
                  <span className="font-size-18 w-100"><FontAwesomeIcon icon={faSignInAlt} size="1x" /> Log in via ModulePal 
                  </span>
              </ToastHeader>
              <ToastBody className="no-pad mb-2">
                <LoginComponent history={history} showHeader={false} />
              </ToastBody>
          </Toast> */}

    const queryingUniUserData = !currentUserData.localData.queriedUniUserBasicData || !currentUserData.localData.queriedUniUserBasicData;

    const loadingView =
      <div className="w-100 text-center">
        <Spinner color="secondary" disabled={true} className="spinner-border-lg centered" />
      </div>

    const view = !loggedIn ?  notLoggedInView : (!emailVerified && !anonymous ? verifyEmailView : (!uniAccountVerified ? (queryingUniUserData ? loadingView : linkStudentAccountView) : (gotNoModules ? null : seeReviewsView)));

    const banner =
        <BannerComponent page="main" history={history}>
          {smallBanner ?
            <React.Fragment>
              <div className="main-page-widget-max-width centered">
                {lead}
              </div>
              <div className="mt-4">
                  <Container className="centered no-pad main-page-widget-max-width">
                  {view}
                  </Container>
              </div>
            </React.Fragment>
          :
            <Row className="justify-content-center">
              <Col className="main-page-widget-max-width">
                  {lead}
              </Col>
              <Col className="main-page-widget-max-width">
                {/* <Card light className="main-page-login-card"> */}
                  {view}
                {/* </Card> */}
              </Col>
            </Row>
          }
      </BannerComponent>;

    const bannerNoView =
      <BannerComponent page="main" history={history}>
        {smallBanner ?
          <React.Fragment>
            <Row className="justify-content-center">
              {lead}
            </Row>
          </React.Fragment>
        :
          <Row className="justify-content-center">
              {lead}
          </Row>
        }
    </BannerComponent>;

    return (
        <React.Fragment>
          <MainWrapperComponent history={history} banner={!view ? bannerNoView : banner} top={top}>
          <PanelComponent backgroundColor="lightgrey" pad={true}>
            <Row>
              <Col className="text-center">
                <h2 className="mb-4">By students, for students</h2>
                <p>Choosing next year’s modules?</p>
                <p>Here, Warwick students share experiences of their modules, helping each other <b>make better decisions</b>.</p>
              </Col>
            </Row>
          </PanelComponent>
          <PanelComponent backgroundColor="white" pad={true}>
            <Row>
              <Col className="text-center large-rounded-buttons">
                <Button color="info" onClick={() => setRedirectToPreview(true)}><FontAwesomeIcon icon={faEye} size="1x"/>&nbsp; View Preview</Button>
              </Col>
            </Row>
          </PanelComponent>
          
            
            {/* <SelectedDepartmentProvider>
            <SelectedModuleProvider>
            <ModuleProvider>
              <Row className="mt-5">
                <Col>
                <Container>
                  <div className="centered">
                  <div className="mb-4">
                  <DepartmentsSearchComponent />
                  </div>
                  <div className="mb-3">
                  <ModulesSearchComponent />
                  </div>
                  </div>
                </Container>
                </Col>
              </Row>
              <Row>
                <ModuleComponent history={history} />
              </Row>
            </ModuleProvider>
            </SelectedModuleProvider>
            </SelectedDepartmentProvider> */}
          </MainWrapperComponent>
        </React.Fragment>
      );
}
