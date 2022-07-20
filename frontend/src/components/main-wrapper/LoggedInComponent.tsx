import React, { useCallback, useState, useContext, useEffect } from 'react';
import {
    NavItem,
    NavLink,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Col,
    Spinner,
  } from 'reactstrap';
import firebaseApp from '../../services/firebase/firebase';
import { User } from "firebase";
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';
import { UniUserBasicData } from '../../services/rest/dto/UniUserBasicData';
import { UniUserDashboardComponent } from './UniUserDashboardComponent';
import { useLocation, Redirect } from 'react-router';
import { AuthContext } from '../../services/firebase/AuthStore';
import { LoadingComponent } from '../LoadingComponent';
import { SpinnerComponent } from '../SpinnerComponent';

export interface LoggedInComponentProps {
    history,
    currentUser: User | null,
    anonymous: boolean | null,
    displayUniUserPreview: boolean
}

export const LoggedInComponent: React.FC<LoggedInComponentProps> = ({ history, currentUser, displayUniUserPreview, anonymous }) => {
    let location = useLocation();
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    const onSettingsPage = location.pathname.startsWith("/settings");
    const onVerifyStudentStatusPage = location.pathname.startsWith("/settings");

    // const [modal, setModal] = useState(false);
    // const toggleModal = () => setModal(!modal);

    const handleLogout = useCallback(async event => {
        event.preventDefault();
        try {
            await firebaseApp
                    .auth()
                    .signOut()
                    .then(() => setRedirectUrl("/"))
                    .catch(reason => alert(reason.message));
        }
        catch (error) {
            alert(error);
        }
    }, [history]);

    const currentUserData = useContext(CurrentUserDataContext);

    const handleVerifyEmail = useCallback(async event => {
        event.preventDefault();
        setRedirectUrl("/settings");
        // history.push("settings");
    }, [history]);

    const handleVerifyUniAccount = useCallback(async event => {
        event.preventDefault();
        setRedirectUrl("/settings");
        // history.push("settings");
    }, [history]);

    const emailVerified = !!currentUser && !!currentUser.emailVerified;
    const uniUserBasicData: UniUserBasicData | null = currentUserData.localData.uniUserBasicData;
    const uniUserModuleRegistrations = currentUserData.localData.uniUserModuleRegistrations;
    const uniAccountVerified = !!uniUserBasicData && !!uniUserBasicData.gotModuleData && uniUserBasicData.gotModuleData;

    const queryingUniUserData = !currentUserData.localData.queriedUniUserBasicData || !currentUserData.localData.queriedUniUserBasicData;

    if (!currentUserData.localData.queriedUniUserBasicData || !currentUserData.localData.uniUserBasicData) {

    }

    // const [verifyEmailTooltipOpen, setVerifyEmailTooltipOpen] = useState(false);
    // const toggle = () => setVerifyEmailTooltipOpen(!verifyEmailTooltipOpen);

    if (!!redirectUrl) {
        return <Redirect to={redirectUrl} />
    }
    
    return (
        <React.Fragment>
            <NavItem>
                <NavLink href="/settings/">My Account</NavLink>
                
            </NavItem>
            <NavItem>
            <Button color="info" onClick={handleVerifyEmail} hidden={emailVerified || onSettingsPage || (!!anonymous && anonymous) } className="navbar-right-button" id="verify"> Verify Email </Button>
            </NavItem>
            {/* <NavItem>
            <Button color="info" onClick={handleVerifyUniAccount} hidden={(uniAccountVerified && emailVerified) || !emailVerified || onSettingsPage || onVerifyStudentStatusPage || queryingUniUserData} className="navbar-right-button" id="verify"> Verify Student Status </Button>
            </NavItem> */}
            
            <NavItem >
                <Spinner color="secondary" hidden={(uniAccountVerified && emailVerified) || !queryingUniUserData || !emailVerified}  disabled={true} className="spinner-border-sm centered uni-data-loader" />
            </NavItem>

            {displayUniUserPreview && !!uniUserBasicData ? <div className="navbar-right-button"><UniUserDashboardComponent /></div> : <div></div>}
            <NavItem>
                <Button color="danger" onClick={handleLogout} className="navbar-right-button"> Log out </Button>
            </NavItem>
        </React.Fragment>
    );
}