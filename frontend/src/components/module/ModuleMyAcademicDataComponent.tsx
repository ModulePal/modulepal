import React, { useContext, useEffect } from "react";
import { ModuleMyAcademicDataContext } from "./context/ModuleMyAcademicDataContext";
import { Alert, Container, Row, Spinner } from "reactstrap";
import { parseAcademicYear } from "./context/ModuleMetadataContext";
import { AuthContext } from "../../services/firebase/AuthStore";
import { LoadingComponent } from "../LoadingComponent";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { SpinnerComponent } from "../SpinnerComponent";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";

export const ModuleMyAcademicDataComponent = props => {
    const moduleMyAcademicDataContext = useContext(ModuleMyAcademicDataContext);
    const currentUser = useContext(AuthContext);
    const myRegistrations = moduleMyAcademicDataContext.myModuleRegistrations;
    const gotRegs = !!myRegistrations && myRegistrations.length > 0;

    function generateCompleteRegistrationsCards() {
        if (!!myRegistrations) {
            const registrationStrings = myRegistrations.map(registration => {
                const academicYear = parseAcademicYear(registration.academicYear);
                return <span key={JSON.stringify(registration)}><b>{academicYear?.display}</b></span>
                // return <span key={JSON.stringify(registration)}>a <b>{grade}</b> grade ({mark}%) in <b>{academicYear?.display}</b></span>
            });
            const joinedRegistrationStrings = registrationStrings.flatMap(
                (value, index, array) =>
                    array.length - 1 !== index // check for the last item
                        ? [value, <span> and </span>]
                        : value,
            );
            return <Alert color="success" className={"mt-4 centered mb-4"}>
                You have taken this module in {joinedRegistrationStrings}, and can make reviews!
            </Alert>
        }
        return null;
    }

    if (currentUser.pending || moduleMyAcademicDataContext.loading) {
        return <SpinnerComponent />
    }

    if (!currentUser.isSignedIn) {
        return (
            <Container>
                <Row>
                    <Alert color="info" className="mb-4 mt-4 centered">
                        You're not logged in, and can only read reviews.
                    </Alert>
                </Row>
            </Container>
        );
    }

    const completeRegistrationsView = gotRegs ? generateCompleteRegistrationsCards() : null;

    const noRegistrationView = !myRegistrations || myRegistrations.length === 0 ?
        <React.Fragment>
            <Alert color="info" className="mb-4 mt-4 centered">
                You have not taken this module, and can only read reviews.
            </Alert>
        </React.Fragment> : null;

    return (
        <Container>
        <Row>
            <React.Fragment>
                {noRegistrationView}
                {completeRegistrationsView}
            </React.Fragment>
        </Row>
        </Container>
    );
}
