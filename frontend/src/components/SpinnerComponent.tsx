import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Container, Row, Spinner, Col } from 'reactstrap';

export const SpinnerComponent = (props) => {
  return (
    <div className="centered text-center justify-content-center">
        <Spinner color="secondary" style={{width: '2rem', height: '2rem'}} className="loading-spinner" />
    </div>
  );
}