import React, { useState, useContext, useEffect } from "react";
import { AcademicYear, ModuleMetadataContext } from "./context/ModuleMetadataContext";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";
import { RatingBasicData } from "../../services/rest/dto/RatingBasicData";
import { Row, Col, Button, Collapse, Card, CardBody, Tooltip, Alert, Spinner } from "reactstrap";
import { RatingType } from "./ModuleRatingTypeAggregatesComponent";
import { ModuleMyReviewComponent } from "./ModuleMyReviewComponent";
import { CanRateStatus, ModuleMyAcademicDataContext } from "./context/ModuleMyAcademicDataContext";
import { ModuleAddReviewComponent } from "./ModuleAddReviewComponent";
import { AuthContext } from "../../services/firebase/AuthStore";

export interface RatingFeedback {
    message: JSX.Element,
    color: string,
    success: boolean
}

export interface ModuleRatingTypeInputComponentProps {
    ratingType: RatingType,
    academicYear: AcademicYear | null,
    showHeatMap: boolean,
    handleShowHeatmap: (e) => void
}

const feedbackDuration = 5000;

export const ModuleRatingTypeInputComponent: React.FC<ModuleRatingTypeInputComponentProps> = ({ ratingType, academicYear, showHeatMap, handleShowHeatmap }) => {
    const moduleMyRatingsContext = useContext(ModuleMyRatingsContext);
    const moduleMyAcademicDataContext = useContext(ModuleMyAcademicDataContext);
    const moduleMetadataContext = useContext(ModuleMetadataContext);
    // const bulkAddReviewsContext = useContext(BulkAddReviewsContext);

    const currentUser = useContext(AuthContext);
    
    const [viewOpen, setViewOpen] = useState(false);

    // const [matchingRatings, setMatchingRatings] = useState<RatingBasicData[]>([]);

    // const [loadingCanRate, setLoadingCanRate] = useState(false);
    // const [canRate, setCanRate] = useState(false);
    const [cannotRateTooltipOpen, setCannotRateTooltipOpen] = useState(false);

    // const [ratedModuleInYear, setRatedModuleInYear] = useState(false);

    const [ratingFeedback, setRatingFeedback] = useState<RatingFeedback | null>(null);

    const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);

    function computeMatchingRatings() {
        // checking if done module in year
        if (!currentUser.isSignedIn) {
            // setLoadingCanRate(false);
            return [];
        }
        const myRatings = moduleMyRatingsContext.myRatings;
        const ratingTypeRatings = moduleMyRatingsContext.ratingTypeRatings;
        const newMatchingRatings: RatingBasicData[] = [];
        if (!!ratingTypeRatings && !!myRatings) {
            const ratings = ratingTypeRatings[ratingType.apiString];
            if (!!ratings && ratings.length > 0) {
                ratings.forEach(ratingId => {
                    const ratingBasicData = myRatings[ratingId];
                    if (!!ratingBasicData) {
                        const year = ratingBasicData.academicYear!!;
                        if (!academicYear || (academicYear.raw === year)) {
                            newMatchingRatings.push(ratingBasicData);   
                        }
                    }
                })
            }
        }
        return newMatchingRatings;
    }

    const matchingRatings = computeMatchingRatings();
    const ratedModuleInYear = matchingRatings.length > 0;

    const adding = !ratedModuleInYear;

    const loading = moduleMyRatingsContext.loadingRatingTypes.includes(ratingType.apiString) || moduleMyAcademicDataContext.loading;

    const canRateStatus = moduleMyAcademicDataContext.canRateInAcademicYear(academicYear);
    const canRate = canRateStatus === CanRateStatus.CAN_RATE;

    function toggleViewOpen() {
        if (adding && !canRate) {
            setViewOpen(false);
        }
        else {
            setViewOpen(!viewOpen);
        }
    }
    
    function setRatingFeedbackBriefly(feedback: RatingFeedback) {
        if (!!feedbackTimeout) {
            clearTimeout(feedbackTimeout);
            setFeedbackTimeout(null);
        }
        setRatingFeedback(feedback);
        setFeedbackTimeout(setTimeout(() => {setRatingFeedback(null); setFeedbackTimeout(null)}, feedbackDuration));
    }

    function feedbackHandler(feedback: RatingFeedback | null, successfulRatingAcademicYear: AcademicYear | null) {
        if (!!feedback) { // if we have feedback may need to do more
            if (feedback.success) { // successfully added or removed, so update the ratings
                moduleMetadataContext.updateMetadata(true); // only update academic years which is why the true is there
            }
            // display feedback briefly
            setRatingFeedbackBriefly(feedback);
        }
    }

    const addReviewButton =
        <React.Fragment>
            <div className="wrap" id={"add-" + ratingType.apiString}>
            <Button color="primary" onClick={canRate ? toggleViewOpen : (() => {})} disabled={!canRate}>Add review</Button>
            </div>
        </React.Fragment>

    const viewReviewButton =
        <React.Fragment>
            <Button color="success" onClick={toggleViewOpen}>View my review</Button>
        </React.Fragment>

    const cancelAddReviewButton =
        <React.Fragment>
            <Button color="secondary" onClick={toggleViewOpen}>Cancel review</Button>
        </React.Fragment>

    const hideReviewButton =
        <React.Fragment>
            <Button color="secondary" onClick={toggleViewOpen}>Hide review</Button>
        </React.Fragment>

    function generateAddOrViewRatingCollapse(): JSX.Element {
        return (
            <Collapse isOpen={viewOpen} active={viewOpen} className="mb-3">          
                {ratedModuleInYear ? <ModuleMyReviewComponent myRatings={matchingRatings} ratingType={ratingType} feedbackHandler={feedbackHandler} closeViewHandler={closeViewHandler} /> : <ModuleAddReviewComponent open={viewOpen} ratingType={ratingType} academicYear={academicYear} feedbackHandler={feedbackHandler} closeViewHandler={closeViewHandler} ></ModuleAddReviewComponent>}
            </Collapse>
        );
    }

    function closeViewHandler() {
        setViewOpen(false);
    }

    var cannotRateTooltipText: JSX.Element | null = null;
    if (canRateStatus === CanRateStatus.CANNOT_RATE_TOOK_MODULE_BUT_NOT_THIS_YEAR) {
        cannotRateTooltipText = <span>You cannot review this module as you did not take it in {academicYear!!.display}.</span>;
    }
    else if (canRateStatus === CanRateStatus.CANNOT_RATE_NOT_TOOK_MODULE_IN_ANY_YEAR) {
        cannotRateTooltipText = <span>You cannot review this module as you have not taken it.</span>; 
    }
    else if (canRateStatus === CanRateStatus.CANNOT_RATE_NOT_LOGGED_IN) {
        cannotRateTooltipText = <span>You cannot review this module as you are not logged in.<br/><a href="/login">Log in</a> to make a review!</span>; 
    }
    
    const cannotRateTooltip = !cannotRateTooltipText ? null :
        <Tooltip autohide={false} placement="bottom" isOpen={cannotRateTooltipOpen} target={"add-" + ratingType.apiString} toggle={() => setCannotRateTooltipOpen(!cannotRateTooltipOpen)}>
            {cannotRateTooltipText}
        </Tooltip>;

    return (
        <React.Fragment>
            <Row className="big-z-index">
                {/* add / view review button */}
                <Col>
                {loading ? <Spinner color="secondary" className="centered"/> : (ratedModuleInYear ? (viewOpen ? hideReviewButton : viewReviewButton) : (viewOpen ? cancelAddReviewButton : <React.Fragment>{addReviewButton}{cannotRateTooltip}</React.Fragment>))}
                </Col>
                {/* show heatmap button */}
                <Col className="right-align">
                    <Button className="right-align" color={showHeatMap ? "secondary" : "info"} active={showHeatMap} onClick={handleShowHeatmap}>{showHeatMap ? "Hide contextual data" : "Contextual data"}</Button>
                </Col>
            </Row>
            <hr></hr>
            {/* add / view rating */}
            {!!ratingFeedback && !loading ? <React.Fragment>
                    <Alert color={ratingFeedback!!.color} className="text-center centered">
                        {ratingFeedback!!.message}
                    </Alert>
                </React.Fragment> : null}
            <Collapse isOpen={viewOpen} active={viewOpen.toString()} className="mb-3">          
                {ratedModuleInYear ? <ModuleMyReviewComponent myRatings={matchingRatings} ratingType={ratingType} feedbackHandler={feedbackHandler} closeViewHandler={closeViewHandler} /> : <ModuleAddReviewComponent open={viewOpen} ratingType={ratingType} academicYear={academicYear} feedbackHandler={feedbackHandler} closeViewHandler={closeViewHandler} ></ModuleAddReviewComponent>}
            </Collapse>
        </React.Fragment>
    );
}   