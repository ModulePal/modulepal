import React, { useContext, useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody, Card, CardTitle, CardText, Container, Row, Alert, Spinner } from 'reactstrap';
import { AuthContext } from '../../services/firebase/AuthStore';
import { LoadingComponent } from "../LoadingComponent";
import { baseUrl } from "../../services/rest/rest";
import { wait } from "@testing-library/react";

export const VerifyEmailComponent = ({ history }) => {
    const currentUser = useContext(AuthContext);

    const [success, setSuccess] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const toggle = () => setSuccess(!success);

    if (currentUser.pending) {
        return <LoadingComponent />
    }

    const handleVerify = event  => {
        setSuccess(false);
        setErrorMessage(null);
        setWaiting(true);
        event.preventDefault();
        if (!!currentUser) {
            var actionCodeSettings = {
                url: "https://modulepal.com/emailVerified"
            };
            currentUser.user?.sendEmailVerification(actionCodeSettings)
            .then(() =>  {
                toggle();
            })
            .catch(reason => {
                const gotMsg = !!reason && !!reason.message;
                setErrorMessage(gotMsg ? reason.message : "Oops! Failed to verify your email. We don't know why this happened - please try again later.");
            });
        }
        setWaiting(false);
    }

    return (
        <React.Fragment>
            <Card body className="text-center">
                <CardTitle><h2>Verify Email</h2></CardTitle>
                <CardText>Please verify your email to make reviews.</CardText>
                <Row>
                    <Container>
                        <Button id="verify-email" color="primary" onClick={handleVerify} disabled={waiting}><Spinner className="spinner-border-sm" hidden={!waiting} /> Send Email Verification Link </Button>
                    </Container>
                </Row>
                <Row hidden={!success} className="mt-3">
                    <Container>
                        <Alert color="success" className="text-center"><span>Verification email sent! Check your inbox within a few minutes and check the spam folder incase it got sent there.<br></br><strong>Note: </strong> make sure to press the blue "Continue" button after following the link in the email to complete the process.</span></Alert>
                    </Container>
                </Row>
                <Row hidden={!errorMessage} className="mt-3">
                    <Container>
                <Alert color="danger" className="text-center">{errorMessage}</Alert>
                    </Container>
                </Row>
            </Card>
      </React.Fragment>
    );
}