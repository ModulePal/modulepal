import React, { useCallback, useContext, useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert, FormFeedback } from 'reactstrap';
import { AuthContext } from '../../services/firebase/AuthStore';
import { Redirect } from "react-router";
import GoogleButton from 'react-google-button';
import { LoadingComponent } from "../LoadingComponent";
import firebaseApp, { signInWithGoogle, signInWithFacebook, googleProvider } from "../../services/firebase/firebase";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { ResetPasswordComponent } from "../shared/ResetPasswordComponent";
import { start } from "repl";
// import FacebookLogin from 'react-facebook-login';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

interface Props {
    history: any,
    showHeader: boolean
}

export const LoginComponent: React.FC<Props> = ({ history, showHeader }) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errorReason, setErrorReason] = useState<string | null>(null);
    const [startedEmail, setStartedEmail] = useState(false);
    const [startedPassword, setStartedPassword] = useState(false);

    const currentUserDataContext = useContext(CurrentUserDataContext);

    const passwordValid = password.length >= 6;
    const emailValid = email.length > 0;

    const handleLogIn = useCallback(async event  => {
        event.preventDefault();
        const form = event.target.elements;

        const { email, password } = event.target.elements;
        
            await firebaseApp
                .auth()
                .signInWithEmailAndPassword(email.value, password.value)
                .then(async (user) => {
                    if (!!user.user) {
                        const token = await user.user.getIdToken();
                        await currentUserDataContext.updateUniUserLocalData(token, true);
                        history.push("/");
                    }
                    else {
                        await currentUserDataContext.voidUniUserLocalData(false);
                    }
                })
                .catch(reason => setErrorReason(reason.message));
    }, [history]);

    // const currentUser = useContext(AuthContext);

    // if (currentUser.pending) {
    //     return <LoadingComponent />
    // }

    // if (currentUser.isSignedIn) {
    //     return <Redirect to="/" />;
    // }

    const handleLogInWithGoogle = useCallback(async event  => {
        event.preventDefault();
        
        await firebaseApp
            .auth()
            .signInWithPopup(googleProvider)
            .then(async (user) => {
                if (!!user.user) {
                    const token = await user.user.getIdToken();
                    await currentUserDataContext.updateUniUserLocalData(token, true);
                    history.push("/");
                }
                else {
                    await currentUserDataContext.voidUniUserLocalData(false);
                }
            })
            .catch(reason => setErrorReason(reason.message));
    }, [history]);

    return (
        <React.Fragment>
            <Container>
            <Col className="login-logout-fields centered ">
                {showHeader ? <h1 className="display-4">Log in</h1> : null}
                <hr></hr>
                <GoogleButton label="Log in with Google" onClick={handleLogInWithGoogle} className="centered"/>
                <hr></hr>
                <Container>
                <Form onSubmit={handleLogIn}>
                <FormGroup className="sign-up-input centered">
                <Label for="exampleEmail">Email</Label>
                <Input type="email" name="email" id="exampleEmail" invalid={!emailValid && startedEmail} onFocus={e => setStartedEmail(true)} onInput={e => {setEmail(e.currentTarget.value)}} className="sign-up-input" />
                <FormFeedback>Please enter an email.</FormFeedback>
                </FormGroup>
                <FormGroup className="sign-up-input centered">
                <Label for="examplePassword">Password</Label>
                <span className="right-align"><ResetPasswordComponent autofillEmail={email}/></span>
                
                <Input type="password" name="password" id="examplePassword" invalid={!passwordValid && startedPassword} onFocus={e => setStartedPassword(true)} onInput={e => {setPassword(e.currentTarget.value)}} className="sign-up-input" />
                <FormFeedback>Your password must be at least 6 characters.</FormFeedback>
                </FormGroup>
                <Row>
                <Col>
                <Alert color="warning text-center" hidden={!errorReason}>{"Oops! " + errorReason}</Alert>
                <div className="text-right">
                <Button size="lg" className="right-align" type="submit" color="primary" disabled={!emailValid || !passwordValid}><FontAwesomeIcon icon={faSignInAlt} size="1x" /> Log in</Button>
                </div>
                </Col>
                </Row>

                <hr></hr>
                <Row>
                <h5 className="text-center centered">New? <a href="/signup">Create an account!</a></h5>
                </Row>
                </Form>
                </Container>
                
            </Col>
            </Container>
      </React.Fragment>
    );
}