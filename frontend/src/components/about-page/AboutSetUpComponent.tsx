import React from 'react';
import { Container, Col, Row, Card, CardTitle, CardText, Button } from 'reactstrap';

export const AboutSetUpComponent = () => {

  return (
    <React.Fragment>
      <Row>
        <Col sm="12" md="6" lg="4">
          <Card body className="account-setup-card">
            <CardTitle><span className="circle text-center">1</span>Create Account</CardTitle>
            <CardText>
              <p><b>Why?</b> You can save your preferences in settings and add reviews.</p>
              <p><b>How?</b> Sign up with an email account or log in with Google. Should receive a confirmation email to your email account. If you logged in with Google, confirmation is done automatically.</p>
            </CardText>
          </Card>
        </Col>
        <Col sm="12" md="6" lg="4">
          <Card body className="account-setup-card">
            <CardTitle><span className="circle text-center">2</span>Verify Student Status</CardTitle>
            <CardText>
              <p><b>Why?</b> This is to prove that you are a student at Warwick, and not a spy from some other university.</p>
              <p>See below for why we ask you to link your student account.</p>
              <p><b>How?</b> Go to <a href="/settings">Settings</a>, where you will be asked to 'Verify Student Status'.</p>
              <p>You will be taken to a Warwick authorisation page, where you should click 'Grant Access'. You will then be redirected back to ModulePal, and after some time you should see that your student status was successfully verified.</p>
            </CardText>
          </Card>
        </Col>
        <Col sm="12" md="6" lg="4">
          <Card body>
            <CardTitle><span className="circle text-center">3</span>Let's Go!</CardTitle>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="font-weight-light">
          <Container>
            <br/>
            <br/>
            <h2>Why we ask you to link your student account</h2>
            <br/>
            <p><b>Please note that you are not required to link your university account to read reviews.</b></p>
            <p>In order to add reviews, we ask you to link your student account for the following reasons:</p>
            <ul>
              <li>We check that your are eligible to add a review to a module. Only students who have completed a module are able to add a review, in order to maintain the integrity of reviews on this site.</li>
              <li>We require some contextual data of your student status to provide students with better review statistics. For ratings, this data in automatically anonymised. For comments, anonymisation can be toggled in Settings.</li>
            </ul>
            <p><b>Your student data will only be visible to you.</b></p>
            <p>Check out our Privacy Policy for more detailed information on how we use your data.</p>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col className="font-weight-light">
          <Container>
            <br/>
            <br/>
            <h2>Can I unlink my student account?</h2>
            <br/>
            <p>Yes. Go to Settings, where you will be able to click 'Unlink My Account'.</p>
            <p>Note that if you do this, any previous reviews that you have made will be hidden from module statistics, but are recoverable if you link your account again.</p>
          </Container>
        </Col>
      </Row>
    </React.Fragment>
  );

}
