import React, { useEffect, useState } from 'react';
import { MainWrapperComponent } from '../main-wrapper/MainWrapperComponent';
import { SignupComponent } from './SignupComponent';
import { TitleBannerComponent } from '../banner/TitleBannerComponent';
import { Col, Container, Row, Card, CardBody, CardTitle } from 'reactstrap';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

export const SignupPageComponent = ({ history }) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', handleWidthChange);
        return () => window.removeEventListener('resize', handleWidthChange);
    })

    function handleWidthChange() {
        setWidth(window.innerWidth);
    }

    const isMobile = width <= 767;

    const card = 
      <Card body light color="light">
        <h5>To sign up, you must:</h5>
        <ul>
        <li>Agree to the <a href="/legal" target="_blank">Terms and Conditions</a> and read and agree with the <a href="/privacy" target="_blank">Privacy Policy</a> of ModulePal.</li>
        {/* <li>Consent to occasionally receive important announcement emails from ModulePal (we strictly do <u>not</u> spam, you can unsubscribe any time). <br></br>Your following helps you stay in the loop of any new features, and helps us run the app!</li> */}
        </ul>
        <hr></hr>
        <h5>After signing up, you will need to:</h5>
        <ul>
        <li>Verify your email and link your University of Warwick Student account in order to <strong>make</strong> reviews. <a href="/about" target="_blank">Why?</a></li>
        </ul>
      </Card>

    return (
        <React.Fragment>
          
          <MainWrapperComponent top={null}  history={history} banner={<TitleBannerComponent titleString="Create an account" history={history} titleIcon={faUserPlus} />}>
            <div className="mt-5">
              {!isMobile ?
                <Container>
                  <Row>
                    <Col>
                      <SignupComponent history={history} />
                      </Col>
                      <Col>
                        {card}
                    </Col>
                  </Row>
                </Container>
              : 
                <Container>
                  <Row className="mb-5">
                    {card}
                  </Row>
                  <Row className="mb-5">
                    <SignupComponent history={history} />
                  </Row>
                </Container>
              
              }
              
            </div>
          </MainWrapperComponent>
        </React.Fragment>
      );
}