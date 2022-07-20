import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faCommentAlt, faVial, faInfoCircle, faCodeBranch, faGraduationCap } from '@fortawesome/free-solid-svg-icons'

import {
    Row,
    Col,
    Container,
  } from 'reactstrap';

export const FooterComponent: React.FC = () => {
    return (
      <React.Fragment>
      <Container className="footer" fluid={true}>
        <footer>
          <Container>
            <Row className="text-secondary">
              <Col className="col-lg-4">
                <p>This app uses your student data only to contextualise and ensure the legitimacy of your reviews. Please read our <a href="/privacy">Privacy Policy</a> for details on what we do with your data.</p>
                {/* <br />
                This app is in Open Beta. */}
              </Col>
              <Col className="offset-lg-2">
                <Row>
                  <Col className="col-12 col-sm-6 text-right">
                    <p><FontAwesomeIcon icon={faBug} size="sm" /> <a href="https://forms.gle/kxUhCMwrgP1NwKZp8" target="_blank">Report a Bug</a></p>
                    <p><FontAwesomeIcon icon={faCommentAlt} size="sm" /> <a href="https://forms.gle/9Cn4utm5cPSeW61QA" target="_blank">Share Feedback</a></p>
                    <p><FontAwesomeIcon icon={faInfoCircle} size="sm" /> <a href="/about">About</a></p>
                  </Col>
                  <Col className="col-12 col-sm-6 text-right">
                    {/* <p><FontAwesomeIcon icon={faShieldAlt} size="sm" /> <a href="/privacy">Privacy Policy</a></p>
                    <p><FontAwesomeIcon icon={faCookieBite} size="sm" /> <a href="/cookies">Cookie Preferences</a></p>
                    <p><FontAwesomeIcon icon={faScroll} size="sm" /> <a href="/legal">Legal</a></p> */}
                    <p><a href="/privacy">Privacy Policy</a></p>
                    <p><a href="/cookies">Cookie Preferences</a></p>
                    <p><a href="/legal">Legal</a></p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </footer>
      </Container>
      <footer>
      <Container className="footer-dark" fluid={true}>
      <Row className="text-muted">
        <Container>
          <Row>
            <Col>
              <FontAwesomeIcon icon={faGraduationCap} size="sm" /> ModulePal v2.6.6-beta
            </Col>
            <Col className="text-right">
            © Omar Tanner 2020-2021
            </Col>
        </Row>
        </Container>
        </Row>
      </Container>
    </footer>
    </React.Fragment>
    );
}
