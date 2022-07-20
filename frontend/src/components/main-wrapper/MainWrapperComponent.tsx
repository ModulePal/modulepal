import React, { useState } from 'react';
import { FooterComponent } from './FooterComponent';
import {
    Row,
    Container,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'reactstrap';
import { NavbarComponent } from './NavbarComponent';

interface MainWrapperComponentProps {
    history: any;
    banner: any | null;
    top: JSX.Element | null;
}

export const MainWrapperComponent: React.FC<MainWrapperComponentProps> = ({ children, history, banner, top }) => {
    //COPYRIGHT GOES IN THE <p>
    return (
        <React.Fragment>
          <div className="main-wrapper-flex">
          {/* <Row> */}
          <NavbarComponent history={history} />
          {/* </Row> */}
          {/* <Row> */}
          <Row>
            {top}
          </Row>
          <Row>
          {banner}
          </Row>

          {/* <Container className="flex-fill no-margin"> */}
          <Row className="flex-fill justify-content-center align-items-center">
            <Container className="wide-view-container">
              {children}
            </Container>
          </Row>
          
          {/* </Container> */}

          {/* </Row> */}

          <FooterComponent />
          </div>

        </React.Fragment>
      );
}
