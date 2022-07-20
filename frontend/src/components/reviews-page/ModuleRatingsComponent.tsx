import React, { useState, useContext } from 'react';
import { AuthContext } from '../../services/firebase/AuthStore';
import { Container, Jumbotron } from 'reactstrap';
import { SelectedModuleContext } from '../context/SelectedModuleContext';

export const ModuleRatingsComponent = () => {
    const authContext = useContext(AuthContext);

    const currentModule = useContext(SelectedModuleContext);

    return (
        <React.Fragment>
              <Container>
              <h2 className="display-4 mt-5">{currentModule.module} — Ratings</h2>
                  <Jumbotron className="full-width">
                    
                    </Jumbotron>
              </Container>
        </React.Fragment>
      );
}