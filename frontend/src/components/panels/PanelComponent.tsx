import React from 'react';
import { Row, Col, Container } from 'reactstrap';

interface PanelComponentProps {
  backgroundColor: String;
  pad: boolean
}

export const PanelComponent = ({ children, backgroundColor, pad }) => {

  const greyPanel =
    <div className="full-width-background lightgrey">
      <Container className={"font-size-21 font-weight-light" + (pad ? " panel-padding" : "")} >
        {children}
      </Container>
    </div>

  const whitePanel =
    <Container className={"font-size-21 font-weight-light" + (pad ? " panel-padding" : "")}>
        {children}
    </Container>

  const panel = backgroundColor=="lightgrey" ? greyPanel : whitePanel;

  return (
    <React.Fragment>
      {panel}
    </React.Fragment>
  );

}
