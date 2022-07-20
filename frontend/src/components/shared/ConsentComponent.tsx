import React, { useContext, useEffect, useState, version } from "react";
import { Redirect } from "react-router";
import { FormGroup, CustomInput, Row, Container, Alert, Button } from "reactstrap";
import { AuthContext } from "../../services/firebase/AuthStore";
import { authCheck } from "../../services/rest/api";
import { Consent } from "../../services/rest/dto/Consent";
import { getErrorResponse } from "../../services/rest/error";
import { SpinnerComponent } from "../SpinnerComponent";

interface Props {
    oauthToken: string,
    oauthVerifier: string,
    permitAuthorise: (newConsent: Consent | null) => Promise<void>
}

export const ConsentComponent: React.FC<Props> = ({oauthToken, oauthVerifier, permitAuthorise }) => {
    const currentUser = useContext(AuthContext);

    const [retry, setRetry] = useState<boolean>(false);
    const [onCooldown, setOnCooldown] = useState<boolean>(true);
    const [consentTerms, setConsentTerms] = useState<boolean>(false);
    const [consentPrivacy, setConsentPrivacy] = useState<boolean>(false);
    const [consentEmail, setConsentEmail] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [waitingApi, setWaitingApi] = useState(false);

    useEffect(() => {
        const retrieveAndSetConsent = async () => {
            setWaitingApi(true);
            if (!!currentUser.idToken) {
                const response = await authCheck(currentUser.idToken, oauthToken, oauthVerifier);
                const errorResponse = getErrorResponse(response);
                if (!errorResponse) {
                    const consent = response.response!!.body.consent;
                    if (!!consent) {
                        if (consent.termsResponse && consent.privacyResponse) {
                            permitAuthorise({
                                termsResponse: null,
                                privacyResponse: null,
                                emailResponse: null
                            });
                        }
                        else {
                            setConsentTerms(consent.termsResponse == null ? false : consent.termsResponse);
                            setConsentPrivacy(consent.privacyResponse == null ? false : consent.privacyResponse);
                            setConsentEmail(consent.emailResponse == null ? false : consent.emailResponse);
                        }
                    }
                }
                else if (!!errorResponse.info.code && errorResponse.info.code === 22) {
                    const cooldownSeconds: number = response.response!!.body.authCooldownSeconds!!;
                    const plural = (cooldownSeconds !== 1 ? "s" : "");
                    setError("Oops! You're linking your account too often. You can make another attempt in " + cooldownSeconds + " second" + plural + ".");
                    setOnCooldown(true);
                    setTimeout(() => {setRetry(true);}, cooldownSeconds * 1000);
                }
                else {
                    setError(errorResponse.info.decoratedFriendlyErrorMessage);
                }
            }
            setWaitingApi(false);
        }
        retrieveAndSetConsent();
    }, [currentUser]);

    if (retry) {
        return <Redirect to="/" />
    }

    if (!currentUser.idToken || waitingApi) {
        return <SpinnerComponent />
    }

    async function confirm() {
        const consent: Consent = {
            termsResponse: consentTerms,
            privacyResponse: consentPrivacy,
            emailResponse: consentEmail
        };
        await permitAuthorise(consent);
    }

    if (!!error) {
        return (
            <Container className="centered text-center justify-content-center">
                <Row className="centered text-center justify-content-center">
                    <Alert color="danger">{error}</Alert>
                </Row>
                {
                    !onCooldown ? null : 
                        <Row className="centered text-center justify-content-center">
                            <SpinnerComponent></SpinnerComponent>
                        </Row>
                }
            </Container>
        );
    }

    return (
        <React.Fragment>
            <Container>
            <Row>
            <FormGroup className="justify-content-left text-left">
                <CustomInput checked={consentTerms && consentPrivacy} valid={consentTerms && consentPrivacy} type="checkbox" id="confirmTos" className="nohighlight" label={<span>I agree to the <a href="/legal" target="_blank">Terms and Conditions</a> and have read and agree with the <a href="/privacy" target="_blank">Privacy Policy</a> of ModulePal.</span>} onChange={(e) => {setConsentTerms(e.currentTarget.checked); setConsentPrivacy(e.currentTarget.checked);}} />
                <CustomInput checked={consentEmail} valid={consentEmail} type="checkbox" id="confirmStudent" className="nohighlight" label={<span>I consent to occasionally receive important announcement emails from ModulePal (you can unsubscribe any time).</span>} onChange={e => setConsentEmail(e.currentTarget.checked)} />
            </FormGroup>
            </Row>
            <Row className="centered text-center justify-content-center" hidden={consentTerms && consentPrivacy}>
                <Alert color="info">Please agree to the Terms and Conditions and Privacy Policy.</Alert>
            </Row>
            <Row className="centered text-center justify-content-center">
                <Button color="primary" disabled={!consentTerms || !consentPrivacy} onClick={confirm}>Confirm my choices</Button>
            </Row>
            </Container>
        </React.Fragment>
    );

    
    
}