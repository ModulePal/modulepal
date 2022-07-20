import React, { useContext } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { PanelComponent } from './PanelComponent';
import metrics from '../../img/Metrics.svg';
import ratings from '../../img/Rating.svg';
import context from '../../img/Context.svg';
import dashboard from '../../img/DashboardExample.jpg';
import { LikeStatus, ModuleTextualComponent } from '../module/ModuleTextualComponent';
import { CanRateStatus } from '../module/context/ModuleMyAcademicDataContext';
import { ModuleCommentsDisplayStrings } from '../module/context/ModuleCommentsContext';
import { UniUserMyReviewsViewComponent } from '../main-wrapper/UniUserMyReviewsComponent';
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';

export const LandingPanelsComponent = () => {
  const currentUserDataContext = useContext(CurrentUserDataContext);

  const dashboardData = [
    {
      "uniId": "1830744",
      "moduleCode": "CS260",
      "moduleName": "CS260 - Algorithms",
      "academicYear": "19/20",
      "numReviews": 11
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS140",
      "moduleName": "CS140 - Computer Security",
      "academicYear": "18/19",
      "numReviews": 10
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS133",
      "moduleName": "CS133 - Professional Skills",
      "academicYear": "18/19",
      "numReviews": 10
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS126",
      "moduleName": "CS126 - Design of Information Structures",
      "academicYear": "18/19",
      "numReviews": 8
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS131",
      "moduleName": "CS131 - Mathematics for Computer Scientists 2",
      "academicYear": "18/19",
      "numReviews": 5
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS132",
      "moduleName": "CS132 - Computer Organisation & Architecture",
      "academicYear": "18/19",
      "numReviews": 0
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS241",
      "moduleName": "CS241 - Operating Systems and Computer Networks",
      "academicYear": "19/20",
      "numReviews": 0
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS262",
      "moduleName": "CS262 - Logic and Verification",
      "academicYear": "19/20",
      "numReviews": 0
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS257",
      "moduleName": "CS257 - Advanced Computer Architecture",
      "academicYear": "19/20",
      "numReviews": 0
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS118",
      "moduleName": "CS118 - Programming for Computer Scientists",
      "academicYear": "18/19",
      "numReviews": 0
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS258",
      "moduleName": "CS258 - Database Systems",
      "academicYear": "19/20",
      "numReviews": 0
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS130",
      "moduleName": "CS130 - Mathematics for Computer Scientists 1",
      "academicYear": "18/19",
      "numReviews": 13
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS141",
      "moduleName": "CS141 - Functional Programming",
      "academicYear": "18/19",
      "numReviews": 12
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS255",
      "moduleName": "CS255 - Artificial Intelligence",
      "academicYear": "19/20",
      "numReviews": 9
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS261",
      "moduleName": "CS261 - Software Engineering",
      "academicYear": "19/20",
      "numReviews": 4
    },
    {
      "uniId": "1830744",
      "moduleCode": "CS259",
      "moduleName": "CS259 - Formal Languages",
      "academicYear": "19/20",
      "numReviews": 7
    }
  ];


  return (
    <React.Fragment>
      <PanelComponent backgroundColor="white" pad={true}>
        <Row>
          <Col xs="12" md="6">
            <h2>Rate</h2>
            <br/>
            <p>Rate modules across a number of metrics, and view existing ratings from other students who took the module</p>
            <br/>
          </Col>
          <Col>
            <img src={ratings} className="panel-img img-ratings" />
          </Col>
        </Row>
      </PanelComponent>
      <PanelComponent backgroundColor="lightgrey" pad={true}>
        <Row>
          <Col xs="12" md="6">
            <h2>Comment</h2>
            <br/>
            <p>Comment on modules, and read existing comments from other students who took the module</p>
            <br/>
          </Col>
          <Col className="home-page-comments normal-font">
            <ModuleTextualComponent 
              ratingId={""} 
              moduleCode={"CS273"} 
              academicYear={{start: 20, end: 21, raw: "20/21", display: "2020 - 2021"}} 
              time= {"2021-04-26T00:00:00"}
              value={"👏START😤THE😤COURSEWORK😤EARLY👏"}
              grade={"I"}
              firstName={null}
              lastName={null}
              departmentCode={null}
              departmentName={null}
              myTextual={false}
              numLikes={7}
              numDislikes={0}
              likeStatus={LikeStatus.None}
              canLike={CanRateStatus.CAN_RATE}
              updatingLike={false}
              handleRemove={() => {}}
              handleLike={async () => {}}
              textualDisplayStrings={ModuleCommentsDisplayStrings}
              cursed={currentUserDataContext.cursed}
              />
          </Col>
        </Row>
      </PanelComponent>
      <PanelComponent backgroundColor="white" pad={true}>
        <Row>
          <Col xs="12" md="4">
            <h2>Metrics</h2>
            <br/>
            <p>Rate modules across a wide range of metrics</p>
            <br/>
          </Col>
          <Col>
              <img src={metrics} className="panel-img img-metrics" />
          </Col>
        </Row>
      </PanelComponent>
      <PanelComponent backgroundColor="lightgrey" pad={true}>
        <Row>
          <Col xs="12" md="6">
            <h2>Context</h2>
            <br/>
            <p>Reviews are anonymously contextualised based on the grades received by reviewers</p>
            <br/>
          </Col>
          <Col>
            <img src={context} className="panel-img img-context" />
          </Col>
        </Row>
      </PanelComponent>
      <PanelComponent backgroundColor="white" pad={true}>
        <Row>
            <Col xs="12" md="5">
              <Container>
              <h2>Personalised</h2>
            <br/>
            <p>Find and review modules with a personal dashboard linked to your university account</p>
            <br/>
              </Container>
            </Col>
            <Col className="normal-font">
              <UniUserMyReviewsViewComponent linkClickCallback={() => {}} moduleRegistrations={dashboardData} />
            </Col>
          </Row>
      </PanelComponent>
    </React.Fragment>
  );

}
