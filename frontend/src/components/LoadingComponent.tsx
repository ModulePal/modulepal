import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Container, Row, Spinner, Col } from 'reactstrap';
import logo from '../img/logo-small-cropped.png'

export const LoadingComponent = (props) => {
  return (
      <Container className="full-height">
          <Row className="full-height centered centered-vertical">
            <div className="centered centered-vertical">
                <div className="centered" style={{width: '5rem', height: '5rem', position: 'absolute', transform: 'translate(0, 1.9rem)'}}>
                  <img src={logo} height="25px" alt="logo-small-loading" style={{display: 'block'}} id="logo-loading" className="centered centered-vertical"></img>
                </div>
                <div className="centered" style={{width: '5rem', height: '5rem'}}>
                  <Spinner color="secondary" style={{width: '5rem', height: '5rem', display: 'block'}} className="centered centered-vertical"/>
                </div>
            </div>
          </Row>
      </Container>
  );
}