import React, { useCallback, useState } from 'react';
import {
    NavItem,
    Button,
  } from 'reactstrap';

export const NotLoggedInComponent = ({ history }) => {
    const handleLogin = useCallback(async (event: React.MouseEvent<any, MouseEvent>) => {
        event.preventDefault();
        history.push("/login");
    }, [history]);

    const handleSignup = useCallback(async (event: React.MouseEvent<any, MouseEvent>) => {
        event.preventDefault();
        history.push("/signup");
    }, [history]);

    return (
        <React.Fragment>
            <NavItem>
                <Button color="primary" className="" onClick={handleLogin}> Log in </Button>
            </NavItem>
            {/* <NavItem>
                <Button color="secondary" className="navbar-right-button" onClick={handleSignup}> Sign up</Button>
            </NavItem> */}
        </React.Fragment>
    );
}