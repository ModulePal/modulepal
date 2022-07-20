import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../services/firebase/AuthStore";
import { LoadingComponent } from "../LoadingComponent";
import { Alert, Spinner, Row, Container } from "reactstrap";
import { getErrorResponse } from "../../services/rest/error";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { setTimeout } from "timers";
import { Redirect } from "react-router";

export const EmailVerifiedComponent = ({ history }) => {
    const [waitingApi, setWaitingApi] = useState(true);
    const [apiSuccess, setApiSuccess] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [redirect, setRedirect] = useState(false);
    

    const currentUser = useContext(AuthContext);

    const currentUniUser = useContext(CurrentUserDataContext);
    const verifiedStudentAccount = !!currentUniUser.localData.uniUserBasicData;

    if (redirect) {
        return <Redirect to={verifiedStudentAccount ? "/" : "/settings"} />
    }

    
    // if (currentUser.pending || !currentUser.idToken) {
    //     return <LoadingComponent />
    // }

    const successAlert =
        waitingApi ? <Alert color="info" className="text-center"><Spinner className="spinner-border-sm" /> Verifying your email, please wait...</Alert>
        :
        (
        apiSuccess ? <Alert color="success" className="text-center">Successfully verified your email! {!verifiedStudentAccount ? <span>What's next? <a href="/settings">Link your student account</a> to start posting reviews!</span> : null}</Alert>
            :
            <Alert color="warning" className="text-center">Successfully verified your email, but failed to sync the change to your accounts. Please re-log your accounts on your devices to keep your browsers up to date. More info on the error below:</Alert>
        );

    const apiErrorAlert =
        !!apiErrorMessage ? <Alert color="danger" className="text-center">{apiErrorMessage}</Alert>
        :
        null; 

    const redirectAlert =
        !waitingApi ? <Alert color="info" className="text-center"><Spinner className="spinner-border-sm" /> <span>{verifiedStudentAccount ? "Redirecting to main page in 5 seconds..." : "Redirecting to settings in 5 seconds..."}</span></Alert>
        :
        null;

    return (
        <React.Fragment>
            <Row className="">
                <Container className="centered">
                    {successAlert}
                </Container>
            </Row>
            <Row className="">
                <Container className="centered">
                    {apiErrorAlert}
                </Container>
            </Row>
            <Row className="mb-5">
                <Container className="centered">
                    {redirectAlert}
                </Container>
            </Row>
        </React.Fragment>

    );
}