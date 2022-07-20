import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../services/firebase/AuthStore";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { userGetInvaliatedRatings } from "../../services/rest/api";
import { LoadingComponent } from "../LoadingComponent";
import { SettingsFeedback } from "./SettingsComponent";
import { Alert, Card, CardTitle, Row, CardBody, Container, CardFooter, Button } from "reactstrap";
import { parseAcademicYear } from "../module/context/ModuleMetadataContext";
import ReactSwitch from "react-switch";
import { AccountSettingsComponent } from "./AccountSettingsComponent";
import { getErrorResponse } from "../../services/rest/error";
import { InvalidatedRatingBasicData } from "../../services/rest/dto/InvalidatedRatingBasicData";
import { RemoveAllRatingsComponent } from "./RemoveAllRatingsComponent";
import { AnonymousComponent } from "./AnonymousComponent";
import { DeleteAccountComponent } from "./DeleteAccountComponent";

export interface MyAccountSettingsFeedback {
    message: JSX.Element,
    color: string
}

const feedbackDuration = 5000;

export const MyAccountComponent = ({ }) => {
    const currentUser = useContext(AuthContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);

    const canHaveUniAccount = (!!currentUser.user && currentUser.user.emailVerified) || currentUser.anonymous;
    const anonymousSettingAvailable = canHaveUniAccount && !!currentUserDataContext.localData.uniUserBasicData && !!currentUserDataContext.localData.uniUserModuleRegistrations;

    const emailVerified = !!currentUser.user && currentUser.user.emailVerified;

    const [feedback, setFeedback] = useState<SettingsFeedback | null>(null);
    const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);

    async function feedbackHandler(newFeedback: SettingsFeedback) {
        setFeedbackBriefly(newFeedback);
    }

    function setFeedbackBriefly(newFeedback: SettingsFeedback) {
        if (!!feedbackTimeout) {
            clearTimeout(feedbackTimeout);
            setFeedbackTimeout(null);
        }
        setFeedback(newFeedback);
        setFeedbackTimeout(setTimeout(() => {setFeedback(null); setFeedbackTimeout(null)}, feedbackDuration));
    }

    const idToken = currentUser.idToken;

    if (!idToken || !currentUser.isSignedIn || currentUser.pending) {
        return null;
    }


    return (
        <React.Fragment>
            <Card body>
                <CardTitle><h2>My Account</h2></CardTitle>
                <Row hidden={!feedback}>
                    <Container>
                        <Alert hidden={!feedback} color={feedback?.color} className="centered text-center">{feedback?.message}</Alert>
                    </Container>
                </Row>
                {anonymousSettingAvailable ?
                <Row className="mb-3">
                    <AnonymousComponent feedbackHandler={feedbackHandler} />
                </Row>
                : null
             }
                <Row>
                    <Container>
                        <Card body>
                            <div className="centered">
                                <DeleteAccountComponent idToken={idToken} feedbackHandler={feedbackHandler} />
                            </div>
                        </Card>
                    </Container>
                </Row>
            </Card>
        </React.Fragment>
    );
}