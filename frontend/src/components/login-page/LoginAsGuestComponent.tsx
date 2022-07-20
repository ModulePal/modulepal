import React, { useCallback, useContext, useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert, FormFeedback } from 'reactstrap';
import firebaseApp from "../../services/firebase/firebase";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { AuthComponent } from "../main-wrapper/AuthComponent";
import { VerifyUniStatusComponent } from "../shared/VerifyUniStatusComponent";

interface Props {
    showDescription: boolean,
    history: any,
    location: any
}

export const LoginAsGuestComponent: React.FC<Props> = ({ history, location, showDescription }) => {
    const [errorReason, setErrorReason] = useState<string | null>(null);

    const currentUserDataContext = useContext(CurrentUserDataContext);

    const handleLogIn = useCallback(async event => {
        await firebaseApp.auth()
        .signInAnonymously()
        .then(async (user) => {
            if (!!user.user) {
                const token = await user.user.getIdToken();
                //await currentUserDataContext.updateUniUserLocalData(token, true);
                await currentUserDataContext.voidUniUserLocalData(false); // remove after testing
                history.push("/");
            }
            else {
                //await currentUserDataContext.voidUniUserLocalData(false);
            }
        })
        .catch(reason => setErrorReason(reason.message));
    }, [history]);

    return (
        <React.Fragment>
            <Container className="mt-3 mb-2">
                <VerifyUniStatusComponent showCard={false} location={location} showDescription={showDescription} />
            </Container>
        </React.Fragment>
    );
}