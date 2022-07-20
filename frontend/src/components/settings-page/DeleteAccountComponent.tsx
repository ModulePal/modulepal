import React, { useState } from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Input, Label } from "reactstrap";
import { userDelete } from "../../services/rest/api";
import { getErrorResponse } from "../../services/rest/error";
import { MyAccountSettingsFeedback } from "./MyAccountComponent";
import { Redirect } from "react-router";
import firebaseApp from "../../services/firebase/firebase";

export interface DeleteAccountComponentProps {
    feedbackHandler: (feedback: MyAccountSettingsFeedback) => Promise<void>
    idToken: string
}

export const DeleteAccountComponent: React.FC<DeleteAccountComponentProps> = ({ feedbackHandler, idToken }) => {
    const [deleteAllReviews, setDeleteAllReviews] = useState(false); // default "delete all reviews" to false
    const [isConfirming, setIsConfirming] = useState(false);
    const [waitingApi, setWaitingApi] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    function toggleIsConfirming() {
        setIsConfirming(!isConfirming);
    }

    function onButtonClick(e) {
        e.preventDefault();
        setIsConfirming(true);
    }

    async function voidSessions() {
        try {
            await firebaseApp
                    .auth()
                    .signOut()
                    .catch(reason => feedbackHandler({
                        message: <span><strong>Successfully deleted your account, but failed to log your out. Please refresh.</strong> {reason}</span>,
                            color: "danger"
                        }));
        }
        catch (error) {
            feedbackHandler({
            message: <span><strong>Successfully deleted your account, but failed to log your out. Please refresh.</strong> {error}</span>,
                color: "danger"
            });
        }
    }

    async function onConfirmClick(e) {
        e.preventDefault();
        setIsConfirming(false);
        setWaitingApi(true);
        const response = await userDelete(idToken, deleteAllReviews);
        const errorResponse = getErrorResponse(response);
        if (!errorResponse) {
            feedbackHandler({
                message: <span>Successfully deleted your account. Logging you out from all of your devices in 5 seconds...</span>,
                color: "success"
            });
            setTimeout(() => voidSessions(), 5000);
        }
        else {
            feedbackHandler({
                message: <span><strong>Failed to delete your account!</strong> {errorResponse.info.friendlyErrorMessage}</span>,
                color: "danger"
            });
        }
        setWaitingApi(false);
    }

    if (redirecting) {
        return <Redirect to="/" />
    }
    
    const button = <Button outline color="danger" onClick={onButtonClick} disabled={waitingApi}><Spinner className="spinner-border-sm" hidden={!waitingApi} /> Delete my account</Button>
    return (
        <React.Fragment>
            {button}
            <Modal isOpen={isConfirming} toggle={toggleIsConfirming}>
                <ModalHeader toggle={toggleIsConfirming}>Are you sure?</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete your account?
                    <br></br>
                    <br></br>
                    All of the data pertaining to your account on ModulePal, and your University of Warwick Student account, will be permanently deleted from ModulePal's database.
                    <br></br><br></br>
                    All of the reviews made on behalf of your university account will become invalidated. This is because we will not be unable to verify whether you have done the module for your reviews, if you're not longer associated with the university account.
                    <br></br><br></br>
                    You will be able to get back the reviews from your university account if you re-link it in the future. 
                    <br></br><br></br>
                    <strong>If you wish to also permanently delete all of the reviews made from your university account</strong>, check "Delete all reviews". 
                    <br></br><br></br>
                    This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                <Label check>
                    <Input type="checkbox" checked={deleteAllReviews} onClick={() => setDeleteAllReviews(!deleteAllReviews)} /> Delete all reviews&nbsp;
                </Label>
                <Button color="danger" onClick={onConfirmClick}>Confirm</Button>
                <Button color="secondary" onClick={toggleIsConfirming}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
}