import React, { useState, useEffect, useContext } from "react";
import { MyAccountSettingsFeedback } from "./MyAccountComponent";
import { Card, CardTitle, Container, CardBody, Col, Row, Spinner } from "reactstrap";
import Toggle from 'react-toggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons'
import { wait } from "@testing-library/react";
import { userSetAnonymous } from "../../services/rest/api";
import { getErrorResponse } from "../../services/rest/error";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { AuthContext } from "../../services/firebase/AuthStore";
import { LoadingComponent } from "../LoadingComponent";

export interface AnonymousComponentProps {
    feedbackHandler: (feedback: MyAccountSettingsFeedback) => Promise<void>
}

export const AnonymousComponent: React.FC<AnonymousComponentProps> = ({ feedbackHandler }) => {
    const currentUser = useContext(AuthContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);

    const [waitingApi, setWaitingApi] = useState(false);

    if (!currentUserDataContext.localData.uniUserBasicData || !currentUser.idToken) {
        return <LoadingComponent />
    }

    const idToken = currentUser.idToken;
    const anonymous: boolean = currentUserDataContext.localData.uniUserBasicData.anonymous;

    async function onAnonymousChange() {
        setWaitingApi(true);
        const response = await userSetAnonymous(idToken, !anonymous);
        const errorResponse = getErrorResponse(response);
        if (!errorResponse) {
            currentUserDataContext.updateAnonymous(!anonymous);
            feedbackHandler({
                message: <span>Successfully updated your anonymous status.</span>,
                color: "success"
            });
        }
        else {
            feedbackHandler({
                message: <span><strong>Failed to update your anonymous status.</strong> {errorResponse.info.friendlyErrorMessage}</span>,
                color: "danger"
            });
        }
        setWaitingApi(false);
    }

    return (
        <Container>
        <Card body>
            <CardTitle><h3>Anonymous</h3></CardTitle>
            <Row>
                <Col>
                    Toggle your anonymous status. Being anonymous hides your name in commments.<br></br>You are not personally identifiable anywhere else.
                </Col>
                <Col className="text-right anonymous-toggle">
                
                <label>
                <Spinner className="spinner-border-sm toggle-padding-spinner" disabled={true} hidden={!waitingApi} />
                    <Toggle
                        checked={anonymous}
                        onChange={onAnonymousChange}
                        icons={false}
                        disabled={waitingApi || anonymous === null}
                        />
                </label>
                </Col>
            </Row>
            
            
        </Card>
        </Container>
    );
}