import React, { useCallback, ReactPropTypes, useContext, useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Spinner, FormFeedback, CustomInput, Alert, Tooltip } from 'reactstrap';
import firebaseApp, { signInWithGoogle } from "../../services/firebase/firebase";
import { AuthContext } from '../../services/firebase/AuthStore';
import { Redirect } from "react-router";
import GoogleButton from "react-google-button";
import { LoadingComponent } from "../LoadingComponent";
import { userAddToMailingList } from "../../services/rest/api";


export const SignupComponent = ({ history }) => {
    const [signedUp, setSignedUp] = useState(false);

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [email, setEmail] = useState("");

    const [agreeEmails, setAgreeEmails] = useState(false);
    const [agreeTos, setAgreeTos] = useState(false);

    const passwordValid = password.length >= 6;
    const confirmPasswordValid = password === confirmPassword;

    const emailValid = email.length > 0;

    const [errorReason, setErrorReason] = useState<string | null>(null);
    
    const agreeMessage = !agreeTos ? "Please agree to the Terms and Conditions and the Privacy Policy." : null;

    const handleSignUp = useCallback(async event  => {
        event.preventDefault();
        const form = event.target.elements;

        const { email, password } = event.target.elements;
        
        await firebaseApp
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value)
            .then(user => {if (user.user) setSignedUp(true)})
            .catch(reason => setErrorReason(reason.message));
    }, [history]);

    const currentUser = useContext(AuthContext);

    useEffect(() => {
        const addToMailingList = async (idToken: string) => {
            const response = await userAddToMailingList(idToken, agreeEmails);
            // do something with response. atm don't do anything since can't really do anything about this failing since they're already logged in -_
        }
        if (signedUp && !!currentUser.idToken) {
            addToMailingList(currentUser.idToken);
            history.push("/");
        }
    }, [currentUser])
    
    if (currentUser.pending) {
        return <LoadingComponent />
    }

    return (
        <React.Fragment>
            <Col className="centered">
                <h1 className="display-4">Sign up</h1>
                <hr></hr>
                <GoogleButton id="sign-up-with-google-button" label="Sign up with Google" onClick={() => {signInWithGoogle(); setSignedUp(true)}} className="centered" disabled={!agreeTos}/>
                <Tooltip
                    isOpen={tooltipOpen && !!agreeMessage}
                    target={"sign-up-with-google-button"}
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                >
                    {agreeMessage}
                </Tooltip>
                <hr></hr>
                
                <Form onSubmit={handleSignUp}>
                    <FormGroup className="sign-up-input centered">
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" invalid={!emailValid} onInput={e => {setEmail(e.currentTarget.value)}}/>
                        <FormFeedback>Please enter an email.</FormFeedback>
                    </FormGroup>
                    <FormGroup className="sign-up-input centered">
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" name="password" id="examplePassword" valid={passwordValid} invalid={!passwordValid} onInput={e => {setPassword(e.currentTarget.value)}} />
                        <FormFeedback>Your password must be at least 6 characters.</FormFeedback>
                    </FormGroup>
                    <FormGroup className="sign-up-input centered">
                        <Label for="confirmPassword">Confirm Password</Label>
                        <Input type="password" name="confirmPassword" id="confirmPassword" valid={confirmPasswordValid} invalid={!confirmPasswordValid || !passwordValid} onInput={e => {setConfirmPassword(e.currentTarget.value)}} />
                        <FormFeedback hidden={passwordValid}>Your password must be at least 6 characters.</FormFeedback>
                        <FormFeedback hidden={!passwordValid || confirmPasswordValid}>Your passwords do not match.</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <CustomInput valid={agreeTos} type="checkbox" id="confirmTos" className="nohighlight" label={<span>I agree to the <a href="/legal" target="_blank">Terms and Conditions</a> and have read and agree with the <a href="/privacy" target="_blank">Privacy Policy</a> of ModulePal.</span>} onChange={e => setAgreeTos(e.currentTarget.checked)} />
    <CustomInput valid={agreeEmails} type="checkbox" id="confirmStudent" className="nohighlight" label={<span>I consent to occasionally receive important announcement emails from ModulePal (you can unsubscribe any time).</span>} onChange={e => setAgreeEmails(e.currentTarget.checked)} />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Alert color="warning text-center" hidden={!agreeMessage && !errorReason}>{!!agreeMessage ? agreeMessage : ("Oops! " + errorReason)}</Alert>
                        <Button size="lg" className="float-right" type="submit" color="primary" disabled={!passwordValid || !confirmPasswordValid || !agreeTos || !emailValid}>Sign up</Button>
                    </FormGroup>
                </Form>
            </Col>
      </React.Fragment>
    );
}