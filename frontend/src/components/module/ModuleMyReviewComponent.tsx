import React, { useContext, useState } from "react";
import { RatingBasicData } from "../../services/rest/dto/RatingBasicData";
import { RatingType } from "./ModuleRatingTypeAggregatesComponent";
import { AcademicYear, parseAcademicYear } from "./context/ModuleMetadataContext";
import { dateDiffFriendlyFromPresentString } from "../../services/helper/time-helper";
import { GRADES, GRADE_INDEXES, removeRating } from "../../services/rest/api";
import { Card, CardHeader, CardBody, CardFooter, Button, Spinner } from "reactstrap";
import { time } from "console";
import { AuthContext, authorisedUser } from "../../services/firebase/AuthStore";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";
import { ModuleAggregatesContext, getRatingContext } from "./context/ModuleAggregatesContext";
import { RatingFeedback } from "./ModuleRatingTypeInputComponent";
import { getErrorResponse, NOT_AUTHORISED_MESSAGE } from "../../services/rest/error";
import { SpinnerComponent } from "../SpinnerComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { ModuleContext } from "./context/ModuleContext";
import { SelectedModuleContext } from "../context/SelectedModuleContext";

export interface ModuleMyReviewComponentProps {
    myRatings: RatingBasicData[],
    ratingType: RatingType,
    feedbackHandler: (feedback: RatingFeedback | null, successfulRatingAcademicYear: AcademicYear | null) => void,
    closeViewHandler: () => void
}

export const ModuleMyReviewComponent: React.FC<ModuleMyReviewComponentProps> = ({ myRatings, ratingType, feedbackHandler, closeViewHandler }) => {
    const currentUser = useContext(AuthContext);
    const moduleContext = useContext(SelectedModuleContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);
    const moduleMyRatingsContext = useContext(ModuleMyRatingsContext);
    const ratingsContext = useContext(getRatingContext(ratingType.apiString));
    const [waitingRemove, setWaitingRemove] = useState(false);
    
    async function removeMyRating(ratingId: string, academicYearRaw: string) {
        setWaitingRemove(true);
        if (authorisedUser(currentUser)) {
            const response = await removeRating(currentUser.idToken!!, ratingId);
            const errorResponse = getErrorResponse(response);
            var feedback = {
                message: <span>Successfully removed review.</span>,
                color: "info",
                success: true
            };
            if (!errorResponse) { // successfully removed so update module my reviews count
                // update dashboard and void external sessions
                await currentUserDataContext.modifyModuleReviewsCount(false, moduleContext.moduleCode!!, academicYearRaw, currentUser.idToken!!);
            }
            else {
                feedback = {
                    message: <span>{errorResponse.info.decoratedFriendlyErrorMessage}</span>,
                    color: "danger",
                    success: false
                };
            }
            moduleMyRatingsContext.removeRating(ratingId);
            closeViewHandler();
            const response2 = await ratingsContext.updateRatingTypeAggregates(false);
            if (!response2) {
                feedback = {
                    message: <span>Failed to update aggregates. Please refresh the page, and if this issue persists please report it.</span>,
                    color: "danger",
                    success: false
                };
            }
            else {
                const errorResponse2 = getErrorResponse(response2);
                if (!!errorResponse2) {
                    feedback = {
                        message: <span>{errorResponse2.info.decoratedFriendlyErrorMessage}</span>,
                        color: "danger",
                        success: false
                    };
                }
            }
            feedbackHandler(feedback, null);
        }
        else {
            feedbackHandler({
                message: <span>{NOT_AUTHORISED_MESSAGE}</span>,
                color: "danger",
                success: false
            }, null);
        }
        setWaitingRemove(false);
    }

    return (
        <React.Fragment>
            {myRatings.map(ratingBasicData => {
                    const academicYear = parseAcademicYear(ratingBasicData.academicYear!!)!!;
                    const time = dateDiffFriendlyFromPresentString(ratingBasicData.time);
                    const grade = !!ratingBasicData.grade ? GRADES[GRADE_INDEXES[ratingBasicData.grade]] : null;
                    const value = ratingType.values[Number(ratingBasicData.value) - 1];
                    const module = ratingBasicData.moduleCode;
                    function remove() {
                        removeMyRating(ratingBasicData.ratingId, academicYear.raw);
                    }
                    return <Card className="mb-3" key={ratingBasicData.ratingId}>
                                <CardHeader>Year: <b>{academicYear?.display}</b> <span className="right-align">Grade: <b>{grade}</b></span></CardHeader>
                                <CardBody>
                                    You gave a review of <b>{value}</b> {time} ago.
                                </CardBody>
                                <CardFooter>
                                    <Button color="danger" className="right-align big-z-index" onClick={remove} disabled={!!waitingRemove}><Spinner className="spinner-border-sm" hidden={!waitingRemove}></Spinner><span hidden={waitingRemove}><FontAwesomeIcon icon={faMinusCircle} size="sm" /></span> Remove review</Button> 
                                </CardFooter>
                            </Card>
                }
            )}
        </React.Fragment>
    );
}