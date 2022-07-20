import React, { useContext, useState } from "react";

import { SettingsFeedback } from "./SettingsComponent";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import { userRemoveAllRatings } from "../../services/rest/api";
import { getErrorResponse } from "../../services/rest/error";
import { MyRatingsSettingsFeedback } from "./MyRatingsComponent";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";

export interface RemoveAllRatingsComponentProps {
    onlyInvalidated: boolean
    feedbackHandler: (feedback: MyRatingsSettingsFeedback) => Promise<void>
    onCompleteHandler: () => Promise<void>
    idToken: string
}

export const RemoveAllRatingsComponent: React.FC<RemoveAllRatingsComponentProps> = ({ onlyInvalidated, feedbackHandler, onCompleteHandler, idToken }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [waitingApi, setWaitingApi] = useState(false);
    const currentUserDataContext = useContext(CurrentUserDataContext);

    function toggleIsConfirming() {
        setIsConfirming(!isConfirming);
    }

    function onButtonClick(e) {
        e.preventDefault();
        setIsConfirming(true);
    }

    async function onConfirmClick(e) {
        e.preventDefault();
        setIsConfirming(false);
        setWaitingApi(true);
        const response = await userRemoveAllRatings(idToken, onlyInvalidated);
        const errorResponse = getErrorResponse(response);
        var feedback = {
            message: <span>Successfully deleted all of your {onlyInvalidated ? "invalidated " : ""}reviews.</span>,
            color: "success"
        };
        if (!errorResponse) {
            // update dashboard and void external sessions
            // note we fully recompute the dashboard!!
            await currentUserDataContext.updateUniUserLocalData(idToken, true);
        }
        else {
            feedback = {
                message: <span><strong>Failed to delete all of your {onlyInvalidated ? "invalidated " : ""}reviews!</strong> {errorResponse.info.friendlyErrorMessage}</span>,
                color: "danger"
            };
        }
        feedbackHandler(feedback);
        setWaitingApi(false);
    }
    
    const button = <Button outline color="danger" onClick={onButtonClick} disabled={waitingApi}><Spinner className="spinner-border-sm" hidden={!waitingApi} /> Delete all my {onlyInvalidated ? "invalidated " : ""}reviews</Button>
    return (
        <React.Fragment>
            {button}
            <Modal isOpen={isConfirming} toggle={toggleIsConfirming}>
                <ModalHeader toggle={toggleIsConfirming}>Are you sure?</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete all of your {onlyInvalidated ? "invalidated " : ""}reviews?
                    <br></br><br></br>
                    All of the reviews made from your university account will be permanently deleted.
                    <br></br><br></br>
                    This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                <Button color="danger" onClick={onConfirmClick}>Confirm</Button>{' '}
                <Button color="secondary" onClick={toggleIsConfirming}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
}