import React, { useContext, useState, useEffect } from 'react';
import { VerifyEmailComponent } from './VerifyEmailComponent';
import { VerifyUniStatusComponent } from '../shared/VerifyUniStatusComponent';
import { AuthContext, updateIdToken } from '../../services/firebase/AuthStore';
import { Container, Row, Col, Card, CardTitle, Button, Alert } from 'reactstrap';
import { ProfileCompletionBarComponent, ProfileCompletionBarProps } from './ProfileCompletionBarComponent';
import { AccountSettingsComponent } from './AccountSettingsComponent';
import { Redirect } from 'react-router';
import { LoadingComponent } from '../LoadingComponent';
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';
import { UniUserBasicData } from '../../services/rest/dto/UniUserBasicData';
import { getErrorResponse } from '../../services/rest/error';
import { TextualFeedback } from '../module/ModuleTextualsComponent';
import { MyRatingsComponent } from './MyRatingsComponent';
import { MyAccountComponent } from './MyAccountComponent';

export interface SettingsFeedback {
    message: JSX.Element,
    color: string
}

const feedbackDuration = 5000;

export const SettingsComponent = ({ history, location }) => {
    const currentUser = useContext(AuthContext);
    const currentUserData = useContext(CurrentUserDataContext);

    const [feedback, setFeedback] = useState<SettingsFeedback | null>(null);
    const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const hash = history.location.hash
        setTimeout(() => {
            if (hash && document.getElementById(hash.substr(1))) {
                // Check if there is a hash and if an element with that id exists
                document.getElementById(hash.substr(1))?.scrollIntoView({behavior: "smooth"});
            }
        }, 1);
        
    }, [history.location.hash]) // Fires every time hash changes

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
    
    const uniUserBasicData: UniUserBasicData | null = currentUserData.localData.uniUserBasicData;
    const uniAccountVerified = !!uniUserBasicData && !!uniUserBasicData.gotModuleData && uniUserBasicData.gotModuleData;

    if (currentUser.pending) {
        return <LoadingComponent />
    }

    const linkingGuestAccount = currentUser.anonymous && !uniUserBasicData;
    if (!currentUser.isSignedIn && !linkingGuestAccount) {
        return <Redirect exact to="/" />
    }

    const showVerifyEmail = currentUser.isSignedIn && !currentUser.user?.emailVerified && !currentUser.anonymous; // have a user, and their email isn't verified and they're not anonymous

    const barProps: ProfileCompletionBarProps = {
        guest: currentUser.anonymous!!,
        emailVerified: !showVerifyEmail,
        tabulaMemberVerified: uniAccountVerified,
        loadingUniUserData: currentUserData.loadingUniUserData
    }

    const canHaveUniAccount = (!!currentUser.user && currentUser.user.emailVerified) || currentUser.anonymous;
    const canReview = canHaveUniAccount && !!currentUserData.localData.uniUserBasicData && !!currentUserData.localData.uniUserModuleRegistrations;

    return (
        <React.Fragment>
            <Container>
                <div className="mb-4">
                <ProfileCompletionBarComponent emailVerified={barProps.emailVerified} tabulaMemberVerified={barProps.tabulaMemberVerified} guest={barProps.guest} loadingUniUserData={barProps.loadingUniUserData}></ProfileCompletionBarComponent>
                </div>
                <Row hidden={!feedback} className="mb-4">
                    <Container>
                    <Alert hidden={!feedback} color={feedback?.color} className="mt-3 centered text-center">{feedback?.message}</Alert>
                    </Container>
                </Row>
                <Row className="mb-4">
                        <Card body>
                            <CardTitle><h2>Actions</h2></CardTitle>
                            <Row>
                            <Col hidden={!showVerifyEmail}>
                            <VerifyEmailComponent history={history}></VerifyEmailComponent>
                            </Col>
                            <Col hidden={showVerifyEmail}>
                            <VerifyUniStatusComponent showCard={true} location={location} showDescription={true}></VerifyUniStatusComponent>
                            </Col>
                            </Row>
                        </Card>
                </Row>
                {canReview ? 
                <Row className="mb-4">
                    <MyRatingsComponent />
                </Row>
                 : null}
                <Row>
                    <MyAccountComponent />
                </Row>
            </Container>
        </React.Fragment>
      );
}