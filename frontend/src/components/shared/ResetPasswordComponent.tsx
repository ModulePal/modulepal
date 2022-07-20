import React, { useContext, useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody, Card, CardTitle, CardText, Container, Row, Form, FormGroup, Label, Input, FormFeedback, Alert, Spinner } from 'reactstrap';
import { AuthContext } from '../../services/firebase/AuthStore';
import { LoadingComponent } from "../LoadingComponent";
import { baseUrl } from "../../services/rest/rest";
import firebaseApp from "../../services/firebase/firebase";
import { wait } from "@testing-library/react";
import { LectureSpeedRatingTypeAggregatesContext } from "../module/context/ModuleAggregatesContext";

export interface ResetPasswordComponentProps {
    autofillEmail: string
}

export const ResetPasswordComponent: React.FC<ResetPasswordComponentProps> = ({ autofillEmail }) => {
    const [email, setEmail] = useState<string>("");
    const emailValid = email.length > 0;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    function resetPassword(e) {
        e.preventDefault();
        setSuccess(false);
        setErrorMessage(null);
        setWaiting(true);
        firebaseApp.auth().sendPasswordResetEmail(email)
            .then(() => setSuccess(true))
            .catch(reason => {setErrorMessage(reason.message); setSuccess(false)});
        setWaiting(false);
    }

    const form = 
        <Form>
        <FormGroup>
        <Label for="email-input">Email</Label>
        <Input type="email" name="email" id="email-input" value={email} invalid={!emailValid} onInput={e => {setSuccess(false); setErrorMessage(null); setEmail(e.currentTarget.value)}} />
        <FormFeedback>Please enter an email.</FormFeedback>
        </FormGroup>
        </Form>

    const submitButton =
        <Button className="right-align" type="submit" color="primary" disabled={!emailValid || waiting} onClick={resetPassword}><span><Spinner className="spinner-border-sm" hidden={!waiting} /> Reset Password</span></Button>

    const errorAlert =
        <Alert color="danger" className="text-center">{errorMessage}</Alert>

    const successAlert =
        <Alert color="success" className="text-center mt-3">A link to reset your password has been sent to <strong>{email}</strong>.</Alert>

    const view =
        <React.Fragment>
            <Row className="" hidden={!errorMessage}>
                <Container className="centered">
                    {errorAlert}
                </Container>
            </Row>
            <Row className="">
                <Container className="centered">
                {form}
                </Container>
            </Row>
            <Row className="">
                <Container className="right-align">
                {submitButton}
                </Container>
            </Row>
            <Row hidden={!success}>
                <Container className="centered">
                    {successAlert}
                </Container>
            </Row>
        </React.Fragment>

    function togglePopover() {
        if (!popoverOpen) {
            setEmail(autofillEmail);
            setSuccess(false);
            setErrorMessage(null);
        }
        setPopoverOpen(!popoverOpen);
    }

    const popover =
        <Popover placement="bottom" isOpen={popoverOpen} target="reset-password-link">
            <PopoverHeader>Reset Your Password</PopoverHeader>
            <PopoverBody>
                {view}
            </PopoverBody>
        </Popover>
    
    const resetPasswordLink =
        <a href="javascript:void(0)" onClick={togglePopover} id="reset-password-link">reset</a>;

    return (
        <React.Fragment>
            {resetPasswordLink}
            {popover}
        </React.Fragment>
    )
}