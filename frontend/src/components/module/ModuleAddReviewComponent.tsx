import React, { useContext, useState, useEffect } from "react";
import { RatingType } from "./ModuleRatingTypeAggregatesComponent";
import { AcademicYear, parseAcademicYear } from "./context/ModuleMetadataContext";
import { ModuleContext } from "./context/ModuleContext";
import { ModuleMyAcademicDataContext } from "./context/ModuleMyAcademicDataContext";
import { CardHeader, Alert, CardBody, Card, CardFooter, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Spinner } from "reactstrap";
import { register } from "../../serviceWorker";
import { addRating } from "../../services/rest/api";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { abort } from "process";
import { getRatingContext } from "./context/ModuleAggregatesContext";
import { AuthContext, authorisedUser } from "../../services/firebase/AuthStore";
import { RatingFeedback } from "./ModuleRatingTypeInputComponent";
import { getErrorResponse, NOT_AUTHORISED_MESSAGE } from "../../services/rest/error";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { SelectedModuleContext } from "../context/SelectedModuleContext";

export interface ModuleAddReviewComponentProps {
    open: boolean,
    ratingType: RatingType,
    academicYear: AcademicYear | null,
    feedbackHandler: (feedback: RatingFeedback | null, successfulRatingAcademicYear: AcademicYear | null) => void,
    closeViewHandler: () => void
}

const errorTimeout: number = 5000;

export const ModuleAddReviewComponent: React.FC<ModuleAddReviewComponentProps> = ({ open, ratingType, academicYear, feedbackHandler, closeViewHandler }) => {
    const moduleContext = useContext(SelectedModuleContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);
    const currentUser = useContext(AuthContext);
    const ratingContext = useContext(getRatingContext(ratingType.apiString));
    const myAcademicDataContext = useContext(ModuleMyAcademicDataContext);
    const myRegistrations = myAcademicDataContext.myModuleRegistrations;
    const myRatingsContext = useContext(ModuleMyRatingsContext);
    const ratingTypeRatings = !!myRatingsContext.ratingTypeRatings ? myRatingsContext.ratingTypeRatings[ratingType.apiString] : null;
    const alreadyRatedYears = getAlreadyRatedYears();
    const [added, setAdded] = useState(false);

    const [waitingAdd, setWaitingAdd] = useState(false);

    function getAlreadyRatedYears(): string[] {
        var result: string[] = [];
        const myRatings = myRatingsContext.myRatings;
        if (!ratingTypeRatings || !myRatings) {
            return result;
        }
        ratingTypeRatings.forEach(ratingId => {
            const ratingBasicData = myRatings[ratingId];
            if (!ratingBasicData || !ratingBasicData.academicYear) {
                return;
            }
            result.push(ratingBasicData.academicYear);
        });
        return result;
    }

    const academicYears = getAcademicYears();

    const [ratingYear, setRatingYear] = useState<AcademicYear | null>(!!academicYears ? getLatestAcademicYear(academicYears) : null);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function init() {
        setRatingYear(!!academicYears ? getLatestAcademicYear(academicYears) : null);
        setYearDropdownOpen(false);
        setErrorMessage(null);
        setSelectedValue(0);
    }

    useEffect(() => {
        init();
      }, [moduleContext, myAcademicDataContext, ratingContext]);
    
    if (!open) {
        return null;
    }

    if (!!errorMessage) {
        return <Alert color="danger">{errorMessage}</Alert>
    }

    function showErrorBrief(errorMsg: string) {
        closeViewHandler();
        feedbackHandler({
            message: <span>{errorMsg}</span>,
            color: "danger",
            success: false
        }, null);
    }
    
    function getAcademicYears(): AcademicYear[] | null {
        var academicYears: AcademicYear[] = [];
        if (!!myRegistrations) {
            if (!!academicYear) {
                // we just search and check it exists
                var found = false;
                myRegistrations.forEach(registration => {
                    if (alreadyRatedYears.includes(registration.academicYear)) {
                        return;
                    }
                    if (registration.academicYear === academicYear.raw) {
                        found = true;
                    }
                })
                return found ? [academicYear] : [];
            }
            myRegistrations.forEach(registration => {
                if (alreadyRatedYears.includes(registration.academicYear)) {
                    return;
                }
                const regAcademicYear = parseAcademicYear(registration.academicYear);
                if (!!regAcademicYear) {
                    academicYears.push(regAcademicYear);
                }
            });
            return academicYears;
        }
        return null;
    }

    if (!!errorMessage) {
        return <Alert></Alert>
    }

    if (added) {
        return null;
    }

    if (!academicYears || academicYears.length === 0) {
        showErrorBrief("Error: you are not authorised to rate this module.");
        return null;
    }

    function getLatestAcademicYear(academicYears: AcademicYear[]) {
        var maxAcademicYear: AcademicYear | null = null;
        academicYears.forEach(academicYear => {
            if (!maxAcademicYear || academicYear.start > maxAcademicYear.start) {
                maxAcademicYear = academicYear;
            }
        })
        return maxAcademicYear;
    }

    if (!ratingYear) {
        showErrorBrief("Error: you are not authorised to rate this module.");
        return null;
    }

    const yearsDropdown =
        <Dropdown isOpen={yearDropdownOpen} toggle={() => setYearDropdownOpen(!yearDropdownOpen)}>
            <DropdownToggle caret color="info">
                Year: {ratingYear.display}
            </DropdownToggle>
            <DropdownMenu>
                {academicYears.map(academicYear => {
                    return <DropdownItem key={academicYear.raw} onClick={() => setRatingYear(academicYear)}>{academicYear.display}</DropdownItem>
                })}
            </DropdownMenu>
        </Dropdown>;

    const labels = {};
    var labelIndex = 0;
    ratingType.values.forEach(value => {
        labels[labelIndex++] = value;
    });

    async function addReviewHandler(e) {
        setWaitingAdd(true);
        e.preventDefault();
        if (authorisedUser(currentUser) && !!moduleContext.moduleCode) {
            const response = await addRating(
                currentUser.idToken!!,
                {
                    removeRatingId: null,
                    moduleCode: moduleContext.moduleCode!!,
                    newRatings: [
                        {
                            type: ratingType.apiString,
                            value: (selectedValue + 1).toString(),
                            academicYear: ratingYear!!.raw,
                            targetRatingId: null
                        }
                    ]
                }
            );
            const errorResponse = getErrorResponse(response);
            var feedback = {
                message: <span>Thank you for your review!</span>,
                color: "success",
                success: true,
            };
            var success = false;
            if (!errorResponse) {
                // update aggregates
                const aggregatesUpdateResponse = await ratingContext.updateRatingTypeAggregates(false);
                if (!aggregatesUpdateResponse) {
                    feedback = {
                        message: <span>Failed to update aggregates. Please refresh the page, and if the issue persists please report it.</span>,
                        color: "danger",
                        success: false
                    };
                }
                else {
                    const errorResponse2 = getErrorResponse(aggregatesUpdateResponse);
                    if (!!errorResponse2) {
                        feedback = {
                            message: <span>{errorResponse2.info.decoratedFriendlyErrorMessage}</span>,
                            color: "danger",
                            success: false
                        }
                    };
                }
                // update their ratings
                closeViewHandler();
                const updateMyRatingsResponse = await myRatingsContext.updateMyRatings([ratingType.apiString], null, !!academicYear ? [academicYear.raw] : null, false);
                if (!updateMyRatingsResponse) {
                    feedback = {
                        message: <span>Failed to update your ratings. Please refresh the page, and if the issue persists please report it.</span>,
                        color: "danger",
                        success: false
                    };
                }
                else {
                    const errorResponse3 = getErrorResponse(updateMyRatingsResponse);
                    if (!!errorResponse3) {
                        feedback = {
                            message: <span>{errorResponse3.info.decoratedFriendlyErrorMessage}</span>,
                            color: "danger",
                            success: false
                        }
                    };
                }
                setAdded(true);
                success = true;
                // update dashboard and void external sessions
                await currentUserDataContext.modifyModuleReviewsCount(true, moduleContext.moduleCode!!, ratingYear!!.raw, currentUser.idToken!!);
            }
            else {
                feedback = {
                    message: <span>{errorResponse.info.decoratedFriendlyErrorMessage}</span>,
                    success: false,
                    color: "danger"
                };
            }
            feedbackHandler(feedback, success ? ratingYear : null);
        }
        else {
            feedbackHandler({
                message: <span>{NOT_AUTHORISED_MESSAGE}</span>,
                success: false,
                color: "danger"
            }, null);
        }
        setWaitingAdd(false);
    }
    return (
        <Card>
            <CardHeader>Year: <b>{ratingYear.display}</b></CardHeader>
            {/* <CardHeader>Year: <b>{ratingYear.display}</b> <span className="right-align">Grade: <b>{grade}</b></span></CardHeader> */}
            <CardBody>
                <Row>
                    {academicYears.length > 1 ? <div className="centered mb-3">{yearsDropdown}</div> : null}
                </Row>
                <Row>
                    <div className="centered rating-slider mb-4">
                        <Slider
                            value={selectedValue}
                            min={0}
                            max={ratingType.values.length - 1}
                            labels={labels}
                            tooltip={false}
                            orientation="horizontal"
                            onChange={(value) => setSelectedValue(value)}
                            format={(value) => ratingType.values[value]}
                        />
                    </div>
                </Row>
                <Row>
                    <div className="centered text-center">
                        <h4><b>{ratingType.values[selectedValue]}</b></h4>
                    </div>
                </Row>
            </CardBody>
            <CardFooter className="big-z-index">
                <Button color="success right-align" onClick={addReviewHandler} disabled={!!waitingAdd}><Spinner className="spinner-border-sm" hidden={!waitingAdd} /><span hidden={waitingAdd}><FontAwesomeIcon icon={faPlusCircle} size="sm" /></span> Add review</Button>
            </CardFooter>
        </Card>
        
    );
}