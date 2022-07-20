import React, { useContext, useEffect, useState } from "react";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { Card, CardTitle, CardText, Button, Popover, PopoverHeader, PopoverBody, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner, Container, Row, Col } from "reactstrap";
import { AuthContext } from "../../services/firebase/AuthStore";
import { LoadingComponent } from "../LoadingComponent";
import { authBegin, authAuthorised, authUnlink } from "../../services/rest/api";
import { ApiResponse } from "../../services/rest/ApiResponse";
import { UserPrimaryUniUserBasicDataResponseBody } from "../../services/rest/responses/body/UserPrimaryUniUserBasicDataResponseBody";
import { AuthBeginResponseBody } from "../../services/rest/responses/body/AuthBeginResponseBody";
import { AuthAuthorisedResponse } from "../../services/rest/responses/AuthAuthorisedResponse";
import { AuthAuthorisedResponseBody } from "../../services/rest/responses/body/AuthAuthorisedResponseBody";
import { getErrorResponse } from "../../services/rest/error";
import firebaseApp from "../../services/firebase/firebase";
import { Redirect } from "react-router";
import { TextualDisplaySettingsComponent } from "../module/TextualDisplaySettingsComponent";
import { ConsentComponent } from "./ConsentComponent";
import { Consent } from "../../services/rest/dto/Consent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

interface Props {
    showCard: boolean,
    location: any,
    showDescription: boolean
}

export const VerifyUniStatusComponent: React.FC<Props> = ({ showCard, location, showDescription }) => {
    const currentUser = useContext(AuthContext);
    const currentUserData = useContext(CurrentUserDataContext);
    const uniUserBasicData = currentUserData.localData.uniUserBasicData;
    const gotUniUserData = !!uniUserBasicData;

    const [idToken, setIdToken] = useState<string | null>(currentUser.idToken);
    const [manualLink, setManualLink] = useState<string | null>(null);
    const [beganPopoverOpen, setBeganPopoverOpen] = useState(false);
    const [unlinkPopoverOpen, setUnlinkPopoverOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [oAuthTempToken, setOAuthTempToken] = useState<string | null>(null);
    const [waitingApi, setWaitingApi] = useState(false);
    const [success, setSuccess] = useState(false);
    const [redirectToMainPage, setRedirectToMainPage] = useState(false);
    const [waitingApiUnlink, setWaitingApiUnlink] = useState(false);
    const [unlinkSuccess, setUnlinkSuccess] = useState(false);
    const [oauthToken, setOAuthToken] = useState<string | null>(null);
    const [oauthVerifier, setOAuthVerifier] = useState<string | null>(null);
    const [consent, setConsent] = useState<Consent | null>(null);
    const [consentToAuthorise, setConsentToAuthorise] = useState<boolean>(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('oauth_token');
        const verifier = urlParams.get('oauth_verifier');
        setOAuthToken(token);
        setOAuthVerifier(verifier);
    }, []);

    useEffect(() => {
        if (consentToAuthorise && !!oauthToken && !!oauthVerifier) {
            onFinish(oauthToken, oauthVerifier);
        }
    }, [oauthToken, oauthVerifier, consentToAuthorise]);

    if (redirectToMainPage) {
        return <Redirect to="/"></Redirect>
    }

    const toggleBeganPopoverOpen = () => setBeganPopoverOpen(!beganPopoverOpen);
    const toggleUnlinkPopoverOpen = () => setUnlinkPopoverOpen(!unlinkPopoverOpen);

    const gotError = !!error;

    const guestLink = !currentUser.isSignedIn || !currentUser.idToken || !currentUser.user;

    const notVerifiedGuestMessage = "To make reviews, you must verify your student status.";
    const notVerifiedNonGuestMessage = "To make reviews, you must verify your student status.";
    
    const notVerifiedMessage = guestLink ? notVerifiedGuestMessage : notVerifiedNonGuestMessage;
    const verifiedMessage = "Your account is already linked to the University of Warwick ID " + uniUserBasicData?.uniId + ". If your module data has changed since you last linked your student account, press the button below to update your data.";
    const cardMessage = gotUniUserData ? verifiedMessage : notVerifiedMessage;
    const title = gotUniUserData ? "Update Student Data" : "Verify Student Status";
    const successMessage = "You have successfully linked your University of Warwick student account.";

    function onPopoverBegin(event) {
        event.preventDefault();
        setError(null);
        setManualLink(null);
        toggleBeganPopoverOpen();
    }

    function onUnlinkPopoverBegin(event) {
        event.preventDefault();
        setError(null);
        setManualLink(null);
        toggleUnlinkPopoverOpen();
    }

    async function onBegin(event) {
        event.preventDefault();
        setError(null);
        setManualLink(null);
        setBeganPopoverOpen(false);
        setWaitingApi(true);
        /*
            If the user is not logged in or if they're logged in a guest but not authenticated, it's a guest request, so obtain an id token
        */
       const guest = !currentUser.isSignedIn;

       var token = idToken;

       if (guest) {
        await firebaseApp.auth()
            .signOut().
            then(async () => {
                await firebaseApp.auth()
                .signInAnonymously()
                .then(async (user) => {
                    if (!!user.user) {
                        token = await user.user.getIdToken();
                        setIdToken(token);
                    }
                    else {
                        setError("Failed to obtain a guest user account. Please try again later.");
                    }
                })
                .catch(reason => setError(reason.message));
            })
            .catch(reason => setError(reason.message));
       }

       if (!!error) return;
    
        const beginResponse: ApiResponse<AuthBeginResponseBody> = await authBegin(token!!, !gotUniUserData);
        
        const errorResponse = getErrorResponse(beginResponse);
        if (!errorResponse) {
            setError(null);
            const responseBody = beginResponse.response!!.body;
            // store temp token
            setOAuthTempToken(responseBody.oauthTempToken);
            // redirect to redirect URL
            var newWindow = window.open(responseBody.redirectUrl, "_self");
            if (!newWindow) {
                setManualLink(responseBody.redirectUrl);
            }
            else {
                newWindow.focus();
            }
        }
        else {
            var errorMessage = errorResponse.info.decoratedFriendlyErrorMessage;
            setError(errorMessage);
        }
    }

    async function onFinish(token: string, verifier: string | null) {
        //event.preventDefault();
        setError(null);
        setManualLink(null);
        setBeganPopoverOpen(false);
        setWaitingApi(true);

        const uniAccountAlreadyVerified = !!uniUserBasicData && !!uniUserBasicData.gotModuleData && uniUserBasicData.gotModuleData;
        // fully refresh their module registrations in the backend if the user is not anonymous, or if they're anonymous but already verified
        const fullRefreshModuleRegistrations = !currentUser.anonymous || uniAccountAlreadyVerified;
        const authorisedResponse: ApiResponse<AuthAuthorisedResponseBody> = await authAuthorised(idToken!!, token, verifier, !gotUniUserData, fullRefreshModuleRegistrations, consent);
        const errorResponse = getErrorResponse(authorisedResponse);
        if (!errorResponse) {
            setError(null);
                // success! show a success message and update uni user data, then once successful redirect
                setSuccess(true);
                await currentUserData.updateUniUserLocalData(idToken!!, true);
                setRedirectToMainPage(true);
        }
        else {
            var errorMessage = errorResponse.info.decoratedFriendlyErrorMessage;
            setError(errorMessage);
            setOAuthTempToken(null);
            setWaitingApi(false);
        }
    }

    
    async function onUnlink(event) {
        event.preventDefault();
        setError(null);
        setManualLink(null);
        setUnlinkPopoverOpen(false);
        setWaitingApiUnlink(true);
        const response = await authUnlink(idToken!!);
        const errorResponse = getErrorResponse(response);
        if (!errorResponse) {
            setError(null);
            // success! show a success message then update uniUserBasicData after 4 seconds
            setUnlinkSuccess(true);
            await currentUserData.updateUniUserLocalData(idToken!!, true);
            setTimeout(() => {setUnlinkSuccess(false)}, 4000);
        }
        else {
            setUnlinkSuccess(false);
            setError(errorResponse.info.decoratedFriendlyErrorMessage);
        }
        setWaitingApiUnlink(false);
    }

    const actionComponent = !!oauthToken && !!oauthVerifier && !consent ?
    <ConsentComponent oauthToken={oauthToken} oauthVerifier={oauthVerifier} permitAuthorise={async (newConsent) => {setConsent(newConsent); setConsentToAuthorise(true);}} />
        : (
            gotUniUserData ?
                <Col className="centered">
                    <Row>
                        <Col className="centered uni-account-buttons">
                            <Button color="primary" className="uni-account-button" onClick={onPopoverBegin} hidden={(!!oAuthTempToken && !gotError) || success} disabled={waitingApi}>
                                {waitingApi ? <React.Fragment><Spinner className="spinner-border-sm"></Spinner> Updating your data... </React.Fragment> : "Update my student data"}
                            </Button>
                        <Button outline color="danger" className="uni-account-button" onClick={onUnlinkPopoverBegin} hidden={(!!oAuthTempToken && !gotError) || success} disabled={waitingApiUnlink}>
                                {waitingApiUnlink ? <React.Fragment><Spinner className="spinner-border-sm"></Spinner> Unlinking your account... </React.Fragment> : "Unlink my student account"}
                            </Button>
                            </Col>
                    </Row>
                </Col>
                :
                    <Button color="primary" onClick={onPopoverBegin} hidden={(!!oAuthTempToken && !gotError) || success} disabled={waitingApi}>
                        {waitingApi ? <React.Fragment><Spinner className="spinner-border-sm"></Spinner> Logging in... </React.Fragment> : <React.Fragment><FontAwesomeIcon icon={faSignInAlt} size="1x" />&nbsp; Log in as a student</React.Fragment>}
                    </Button>
        );

    const alerts = <React.Fragment>
        <Alert color="warning" hidden={!manualLink} className="text-center"><span>Oops! Looks like your browser blocked the Warwick Portal popup. Please allow the popup or access the login portal manually by this link: <a href={!manualLink ? undefined : manualLink}>{manualLink}</a> </span></Alert>
        <Alert color="danger" hidden={!gotError || success || unlinkSuccess} className="text-center">{error}</Alert>
        <Alert color="success" hidden={!success} className="text-center">{successMessage}</Alert>
        <Alert color="success" hidden={!unlinkSuccess} className="text-center">You have successfully unlinked your University of Warwick student account.</Alert>
    </React.Fragment>;

    const row = 
        <Row>
            <Container>
            {actionComponent}
            <Col className="centered">
            <Button color="success" hidden={gotError || !oAuthTempToken} disabled={waitingApi || success} onClick={() => {if (!!oAuthTempToken) onFinish(oAuthTempToken, null)}}>
                {(waitingApi || success) ? <React.Fragment><Spinner className="spinner-border-sm"></Spinner> Linking your account... </React.Fragment> : "Finish"}
            </Button>
            </Col>
            </Container>
        </Row>;
    
    return (
        <React.Fragment>
            {showCard ? <Card body className="text-center verify-student-status-card">
                {guestLink ? null : <CardTitle><h3>{title}</h3></CardTitle>} 
                {!oauthToken && showDescription ? <CardText>{cardMessage}</CardText> : null}
                {alerts}
                {row}
            </Card> :
                <React.Fragment>
                    <div className="text-center verify-student-status-card">
                        {guestLink ? null : <h3>{title}</h3>}
                        {showDescription ? <CardText>{cardMessage}</CardText> : null}
                        {alerts}
                        {row}
                    </div>
                </React.Fragment>
            }
            {/* link account modal */}
            <Modal isOpen={beganPopoverOpen} toggle={toggleBeganPopoverOpen}>
                <ModalHeader toggle={toggleBeganPopoverOpen}>Student Account Linking Instructions</ModalHeader>
                <ModalBody>
                Press the button below to be taken to the University of Warwick's login portal. Please log in, and press 'Grant access' to share your student data.<br></br><br></br>
                Once finished, you will be redirected back to ModulePal. Wait a few seconds, and your account should be successfully verified.<br></br><br></br>
                Concerned about the privacy of your Warwick account? See the <a href="/about">About Page</a> or the <a href="/privacy#warwick">Warwick section of our Privacy Policy</a> for details on how we use your data confidentially.
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={onBegin}>Verify via Warwick</Button>{' '}
                <Button color="secondary" onClick={toggleBeganPopoverOpen}>Cancel</Button>
                </ModalFooter>
            </Modal>
            {/* unlink account modal */}
            <Modal isOpen={unlinkPopoverOpen} toggle={toggleUnlinkPopoverOpen}>
                <ModalHeader toggle={toggleUnlinkPopoverOpen}>Are you sure?</ModalHeader>
                <ModalBody>
                    Are you sure you want to unlink your student account? <br></br><br></br>
                    All of the data pertaining to your University of Warwick Student account will be permanently deleted from ModulePal's database.<br></br><br></br>
                    All of the reviews made on behalf of your university account will become invalidated. This is because we will not be unable to verify whether you have done the module for your reviews, if you're not longer associated with the university account.
                    <br></br><br></br>
                    You will be able to get back the reviews from your university account if you re-link it in the future.
                </ModalBody>
                <ModalFooter>
                <Button color="danger" onClick={onUnlink}>Confirm</Button>
                <Button color="secondary" onClick={toggleUnlinkPopoverOpen}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
}