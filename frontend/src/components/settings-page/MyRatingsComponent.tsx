import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../services/firebase/AuthStore";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { userGetInvaliatedRatings } from "../../services/rest/api";
import { LoadingComponent } from "../LoadingComponent";
import { Alert, Card, CardTitle, Row, CardBody, Container, CardFooter, Button } from "reactstrap";
import { parseAcademicYear } from "../module/context/ModuleMetadataContext";
import ReactSwitch from "react-switch";
import { AccountSettingsComponent } from "./AccountSettingsComponent";
import { getErrorResponse } from "../../services/rest/error";
import { InvalidatedRatingBasicData } from "../../services/rest/dto/InvalidatedRatingBasicData";
import { RemoveAllRatingsComponent } from "./RemoveAllRatingsComponent";

export interface MyRatingsSettingsFeedback {
    message: JSX.Element,
    color: string
}

const feedbackDuration = 5000;

export const MyRatingsComponent = ({ }) => {
    const currentUser = useContext(AuthContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);

    const idToken = currentUser.idToken;

    const [invalidatedRatings, setInvalidatedRatings] = useState<InvalidatedRatingBasicData[]>([]);

    /* feedback */
    const [feedback, setFeedback] = useState<MyRatingsSettingsFeedback | null>(null);
    const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);

    async function feedbackHandler(newFeedback: MyRatingsSettingsFeedback) {
        setFeedbackBriefly(newFeedback);
    }

    function setFeedbackBriefly(newFeedback: MyRatingsSettingsFeedback) {
        if (!!feedbackTimeout) {
            clearTimeout(feedbackTimeout);
            setFeedbackTimeout(null);
        }
        setFeedback(newFeedback);
        setFeedbackTimeout(setTimeout(() => {setFeedback(null); setFeedbackTimeout(null)}, feedbackDuration));
    }
    /* end of feedback */

    if (!idToken || !currentUser.isSignedIn || currentUser.pending) {
        return <LoadingComponent />
    }

    async function successfullyDeletedHandler() {
        setFeedbackBriefly({
            message: <span>"Successfully deleted all of your reviews."</span>,
            color: "success"
        });
    }

    return (
        <React.Fragment>
            <Card body>
                <CardTitle><h2>My Reviews</h2></CardTitle>
                {/* <CardBody> */}
                <Row hidden={!feedback}>
                    <Container>
                        <Alert hidden={!feedback} color={feedback?.color} className="centered text-center">{feedback?.message}</Alert>
                    </Container>
                </Row>
                <Card body>
                <Row>
                    <div className="centered">
                    <RemoveAllRatingsComponent onlyInvalidated={false} feedbackHandler={feedbackHandler} onCompleteHandler={successfullyDeletedHandler} idToken={idToken} />
                    {/* <Button outline color="danger" className="centered">Delete all my ratings</Button> */}
                    </div>
                </Row>
                </Card>
            </Card>
        </React.Fragment>
    );
}