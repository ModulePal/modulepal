import React, { useState } from "react";
import BannerImage  from '../../img/BannerImage.jpg';

import {
    Row,
    Col,
    Container,
  } from 'reactstrap';

interface BannerComponentProps {
    page: String;
    history: any;
}

export const BannerComponent: React.FC<BannerComponentProps> = ({ children, page, history }) => {


        return (
            <React.Fragment>
              <Container className="banner" fluid={true} style={{ backgroundImage: `url(${BannerImage})` }}>
                <Container>
                <Container>
                  <Row className="justify-content-center align-items-center">
                    <Container className="">
                      {children}
                    </Container>
                  </Row>
                </Container>
                </Container>
              </Container>
            </React.Fragment>
        );
    // }

}
