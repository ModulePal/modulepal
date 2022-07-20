import React, { useState, useContext, useEffect } from "react";
import { Input, FormFeedback, Form, Card, FormGroup, CardBody, Container, Button, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, CardTitle, Col, Spinner, Tooltip, Alert } from "reactstrap";
import { TextualFeedback } from "./ModuleTextualsComponent";
import { addRating } from "../../services/rest/api";
import { AuthContext, authorisedUser } from "../../services/firebase/AuthStore";
import { ModuleContext } from "./context/ModuleContext";
import { AcademicYear, parseAcademicYear } from "./context/ModuleMetadataContext";
import { getRatingContext } from "./context/ModuleAggregatesContext";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";
import { ModuleMyAcademicDataContext } from "./context/ModuleMyAcademicDataContext";
import { getErrorResponse, NOT_AUTHORISED_MESSAGE } from "../../services/rest/error";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faExclamation, faExclamationCircle, faInfoCircle, faMask, faPlusCircle, faUserCheck, faUserShield, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { SelectedModuleContext } from "../context/SelectedModuleContext";
import { TextualDisplayStrings, ModuleTextualDataFunctional } from "./context/ModuleTextualContext";
import { textSpanIntersection } from "typescript";
import { text } from "@fortawesome/fontawesome-svg-core";

export interface Props {
    academicYear: AcademicYear | null,
    feedbackHandler: (feedback: TextualFeedback) => Promise<void>,
    textualDisplayStrings: TextualDisplayStrings,
    textualApiString: string
}

const maxChars = 255;
const minChars = 3;

export const AddTextualComponent: React.FC<Props> = ({ feedbackHandler, academicYear, textualDisplayStrings, textualApiString }) => {
    const currentUser = useContext(AuthContext);
    const moduleContext = useContext(SelectedModuleContext);
    const myRatingsContext = useContext(ModuleMyRatingsContext);
    const myAcademicDataContext = useContext(ModuleMyAcademicDataContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);
    const registrations = myAcademicDataContext.myModuleRegistrations;
    const [waitingAdd, setWaitingAdd] = useState(false);
    const [ratingYear, setRatingYear] = useState<AcademicYear | null>(null);
    const [academicYears, setAcademicYears] = useState<AcademicYear[] | null>(null);
    const [anonymousIconTooltipOpen, setDescTooltipOpen] = useState(false);
    const [textualLegalTooltipOpen, setTextualLegalTooltipOpen] = useState(false);

    const ratingTypeRatings = !!myRatingsContext.ratingTypeRatings ? myRatingsContext.ratingTypeRatings[textualApiString] : null;

    const alreadyRatedYears = getAlreadyRatedYears();

    function getAlreadyRatedYears(): string[] {
        var result: string[] = [];
        const myRatings = myRatingsContext.myRatings;
        if (!ratingTypeRatings || !myRatings) {
            return result;
        }
        ratingTypeRatings.forEach(ratingId => {
            const ratingBasicData = myRatings[ratingId];
            if (!ratingBasicData.academicYear) {
                return;
            }
            result.push(ratingBasicData.academicYear);
        });
        return result;
    }

    function getAcademicYears(): AcademicYear[] | null {
        if (!!registrations) {
            if (!!academicYear) {
                // we just search and check it exists
                var found = false;
                registrations.forEach(registration => {
                    if (alreadyRatedYears.includes(registration.academicYear)) {
                        return;
                    }
                    if (registration.academicYear === academicYear.raw) {
                        found = true;
                    }
                })
                return found ? [academicYear] : [];
            }
            var academicYears: AcademicYear[] = [];
            registrations.forEach(registration => {
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
        
    function getLatestAcademicYear(academicYearss: AcademicYear[]): AcademicYear | null {
        var maxAcademicYear: AcademicYear | null = null;
        academicYearss.forEach(year => {
            if (maxAcademicYear === null || (year.start > maxAcademicYear.start)) {
                maxAcademicYear = {
                    raw: year.raw,
                    display: year.display,
                    start: year.start,
                    end: year.end
                };
            }
        });
        return maxAcademicYear;
    }

    useEffect(() => {
        const newAcademicYears = getAcademicYears();
        setAcademicYears(newAcademicYears);
        const latestAcademicYear = !!newAcademicYears ? getLatestAcademicYear(newAcademicYears) : null;
        setRatingYear(latestAcademicYear);
    }, [myAcademicDataContext])
    

    const [textualValue, setTextualValue] = useState<string>("");
    const [charCount, setCharCount] = useState<number>(0);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

    const invalid = charCount > maxChars || charCount < minChars;

    if (!currentUser.isSignedIn) {
        return null;
    }

    function inputHandler(event: React.FormEvent<HTMLInputElement>): void {
        const value: string = event.currentTarget.value;
        if (!value) {
            return;
        }
        setTextualValue(value);
        setCharCount(value.length);
        // EASTER EGG LAMBDAS
        var numLambdas = (value.match(/λ/g)||[]).length;
        var lamdasPow3 = numLambdas != 0 && numLambdas != 1 && 1162261467 % numLambdas == 0;
        var containsMonad = value.toLowerCase().includes("monad");
        currentUserDataContext.setCursed(lamdasPow3 || containsMonad);
    }

    const inputFeedback =
            !invalid ? null : (
                charCount > maxChars ?
                    <FormFeedback>Your {textualDisplayStrings.singular} is too long!</FormFeedback>
                    :
                    <FormFeedback>Your {textualDisplayStrings.singular} must be at least 3 characters long.</FormFeedback>
        );

    if (!ratingYear || !academicYears || academicYears.length === 0) {
        return null;
    }

    const yearsDropdown =
    <Dropdown isOpen={yearDropdownOpen} toggle={() => setYearDropdownOpen(!yearDropdownOpen)}>
        <DropdownToggle caret color="info" disabled={academicYears.length <= 1}>
            Year: {ratingYear.display}
        </DropdownToggle>
        <DropdownMenu>
            {academicYears.map(academicYear => {
                return <DropdownItem key={academicYear.raw} onClick={() => setRatingYear(academicYear)}>{academicYear.display}</DropdownItem>
            })}
        </DropdownMenu>
    </Dropdown>;

    async function onAdd(e) {
        setWaitingAdd(true);
        if (invalid || !ratingYear) return;
        if (authorisedUser(currentUser)) {
            const response = await addRating(
                currentUser.idToken!!,
                {
                    removeRatingId: null,
                    moduleCode: moduleContext.moduleCode!!,
                    newRatings: [
                        {
                            type: textualApiString,
                            value: textualValue,
                            academicYear: ratingYear.raw,
                            targetRatingId: null
                        }
                    ]
                }
            );
            const errorResponse = getErrorResponse(response);
            var feedback: TextualFeedback = {
                message: <span>Thank you for your {textualDisplayStrings.singular}!</span>,
                update: true,
                color: "success"
            };
            if (!errorResponse) {
                // update dashboard and void external sessions
                await currentUserDataContext.modifyModuleReviewsCount(true, moduleContext.moduleCode!!, ratingYear.raw, currentUser.idToken!!);
            }
            else {
                feedback = {
                    message: <span>{errorResponse.info.decoratedFriendlyErrorMessage}</span>,
                    update: false,
                    color: "danger"
                }
            }
            feedbackHandler(feedback);
        }
        else {
            feedbackHandler({
                message: <span>{NOT_AUTHORISED_MESSAGE}</span>,
                update: false,
                color: "danger"
            });
        }
        setWaitingAdd(false);
    }

    const anonymous = currentUserDataContext.localData.uniUserBasicData?.anonymous;
    const name = currentUserDataContext.localData.uniUserBasicData?.firstName + " " + currentUserDataContext.localData.uniUserBasicData?.lastName;

    return (
        <React.Fragment>
             <Row className="mb-3">
                <div className="p-3 bg-light my-2 rounded centered">
                <Card body>
                    <CardTitle>
                        <Row>
                            <Col>
                                <h3 className="lead">Add {textualDisplayStrings.singular}<span id="ensure-comment-legal">*</span></h3>
                                <Tooltip
                                    placement="top"
                                    isOpen={textualLegalTooltipOpen}
                                    target={"ensure-comment-legal"}
                                    toggle={() => setTextualLegalTooltipOpen(!textualLegalTooltipOpen)}
                                    autohide={false}
                                >
                                    If your {textualDisplayStrings.singular} is found to be in violation of our <a href="/legal">Terms and Conditions</a>, we reserve the right to remove it.
                                </Tooltip>
                            </Col>
                            <Col xs={2} className="right-align">
                                <Tooltip
                                    placement="top"
                                    isOpen={anonymousIconTooltipOpen}
                                    target={"anonymous-icon"}
                                    toggle={() => setDescTooltipOpen(!anonymousIconTooltipOpen)}
                                    autohide={false}
                                >
                                    You will appear as <strong>{anonymous ? "Anonymous User" : name}</strong> in your {textualDisplayStrings.singular}.
                                </Tooltip>
                                <h4><span className="text-right right-align"><FontAwesomeIcon icon={anonymous ? faUserShield : faUserCheck} size="lg" id={"anonymous-icon"} /></span></h4>
                                </Col>
                            </Row>
                    </CardTitle>
                    <Container>
                        <Row className="">
                        <Form className="comment-input">
                            <Input type="textarea" name="text" id="exampleText" onChange={inputHandler} invalid={invalid} className="comment-input" />
                            {inputFeedback}
                            <div className="mb-3"></div>
                        </Form>
                        </Row>
                        {/* <Row>
                            <Tooltip
                                placement="top"
                                isOpen={textualLegalTooltipOpen}
                                target={"ensure-comment-legal"}
                                toggle={() => setTextualLegalTooltipOpen(!textualLegalTooltipOpen)}
                                autohide={false}
                            >
                                If your {textualDisplayStrings.singular} is found to be in violation of our <a href="/legal">Terms and Conditions</a>, we reserve the right to remove it.
                            </Tooltip>
                            <Alert color="info w-100"><h5>Before {textualDisplayStrings.progressiveAction}, please ensure<span id="ensure-comment-legal">*</span>:</h5>
                                <li>It does not contain offensive or derogatory language.</li>
                                <li>It does not harm the reputation of another person.</li>
                                <li>It reflects your opinion and experiences accurately.</li>
                            </Alert>
                        </Row> */}
                        <Row>
                            <Col className="pad-left-0">
                                {academicYears.length <= 1 ? null : yearsDropdown}
                            </Col>
                            <Col className="right-align ml-auto pad-right-0">
                                <Button color="success" className="right-align ml-auto" disabled={invalid || waitingAdd} onClick={onAdd}><Spinner className="spinner-border-sm" hidden={!waitingAdd} /><span hidden={waitingAdd}><FontAwesomeIcon icon={faPlusCircle} size="sm" /></span> Add {textualDisplayStrings.singular} </Button>
                            </Col>
                        </Row>
                    </Container>
                </Card>
                </div>
            </Row>
            
        </React.Fragment>
    );
}