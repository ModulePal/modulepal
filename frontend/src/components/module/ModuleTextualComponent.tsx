import React, { useContext, useState } from "react";
import { Card, CardHeader, CardBody, CardTitle, CardText, Button, CardFooter, Row, Col, Container, Spinner, Tooltip } from "reactstrap";
import { AcademicYear } from "./context/ModuleMetadataContext";
import { dateDiffFriendlyFromPresentString } from "../../services/helper/time-helper";
import { GRADES, GRADE_INDEXES } from "../../services/rest/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
import { TextualDisplayStrings } from "./context/ModuleTextualContext";
import { computeTextualLikePercentageRaw } from "./TextualsHelper";
import { CanRateStatus } from "./context/ModuleMyAcademicDataContext";
import cursedPlusOne from "../../img/cursed-plus-one.png";
import cursedMinusOne from "../../img/cursed-minus-one.png";
import cursedPlusOneUnfilled from "../../img/cursed-plus-one-unfilled.png";
import cursedMinusOneUnfilled from "../../img/cursed-minus-one-unfilled.png";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";

export enum LikeStatus {
    Liked,
    Disliked,
    None
}

export interface ModuleCommentComponentProps {
    ratingId: string,
    moduleCode: string,
    academicYear: AcademicYear,
    time: string,
    value: string,
    grade: string,
    firstName: string | null,
    lastName: string | null,
    departmentCode: string | null,
    departmentName: string | null,
    myTextual: boolean,
    numLikes: number,
    numDislikes: number,
    likeStatus: LikeStatus,
    canLike: CanRateStatus,
    updatingLike: boolean,
    handleRemove: (ratingId: string, academicYearRaw: string) => void,
    handleLike: (ratingId: string, academicYearRaw: string, newLikeStatus: LikeStatus) => Promise<void>
    textualDisplayStrings: TextualDisplayStrings,
    cursed: boolean // FOR EASTER EGG
}

export const ModuleTextualComponent: React.FC<ModuleCommentComponentProps> = ({ratingId, moduleCode, academicYear, time, value, grade, firstName, lastName, departmentCode, departmentName, myTextual, numLikes, numDislikes, likeStatus, canLike, handleRemove, handleLike, textualDisplayStrings, updatingLike, cursed }) => {
    const name = ((!!firstName && !!lastName) ? firstName + " " + lastName : "Anonymous User") + (!!departmentCode ? " (" + departmentCode + ")" : "");
    const context = "achieved " + GRADES[GRADE_INDEXES[grade]] + " grade in " + academicYear.display;
    const [waitingRemove, setWaitingRemove] = useState(false);
    const [cannotLikeTooltipOpen, setCannotLikeTooltipOpen] = useState<boolean>(false);
    const [cannotDislikeTooltipOpen, setCannotDislikeTooltipOpen] = useState<boolean>(false);

    const [updatingLikeStatus, setUpdatingLikeStatus] = useState<LikeStatus | null>(null);

    function remove(e) {
        setWaitingRemove(true);
        e.preventDefault();
        handleRemove(ratingId, academicYear.raw);
        setWaitingRemove(false);
    }

    async function like(newLikeStatus: LikeStatus) {
        if (updatingLike || updatingLikeStatus !== null || canLike !== CanRateStatus.CAN_RATE) return;
        setUpdatingLikeStatus(newLikeStatus);
        await handleLike(ratingId, academicYear.raw, newLikeStatus);
        setUpdatingLikeStatus(null);
    }

    const removeRatingOnClick = async () => like(LikeStatus.None);
    const likeOnClick = async () => like(LikeStatus.Liked);
    const dislikeOnClick = async () => like(LikeStatus.Disliked);

    

    function computeCannotLikeTooltip(like: boolean): JSX.Element | null {
        const likeString = like ? "like" : "dislike";
        var cannotLikeTooltipText: JSX.Element | null = null;
        if (canLike === CanRateStatus.CANNOT_RATE_TOOK_MODULE_BUT_NOT_THIS_YEAR) {
            cannotLikeTooltipText = <span>You cannot {likeString} this {textualDisplayStrings.singular} as you did not take {moduleCode} in {academicYear.display}.</span>;
        }
        else if (canLike === CanRateStatus.CANNOT_RATE_NOT_TOOK_MODULE_IN_ANY_YEAR) {
            cannotLikeTooltipText = <span>You cannot {likeString} this {textualDisplayStrings.singular} as you have not taken {moduleCode}.</span>; 
        }
        else if (canLike === CanRateStatus.CANNOT_RATE_NOT_LOGGED_IN) {
            cannotLikeTooltipText = <span>You cannot {likeString} this {textualDisplayStrings.singular} as you are not logged in.<br/><a href="/login">Log in</a> to make a review!</span>; 
        }
        return !cannotLikeTooltipText ? null : 
        <Tooltip autohide={false} placement="bottom" isOpen={like ? cannotLikeTooltipOpen : cannotDislikeTooltipOpen} target={likeString + "-" + ratingId} toggle={() => like ? setCannotLikeTooltipOpen(!cannotLikeTooltipOpen) : setCannotDislikeTooltipOpen(!cannotDislikeTooltipOpen)}>
            {cannotLikeTooltipText}
        </Tooltip>;
    }
    

    const ghostLikeStatus = updatingLikeStatus !== null ? updatingLikeStatus : likeStatus;
    const cursorHoverClass = canLike === CanRateStatus.CAN_RATE ? "clickable" : "";

    var likeButton = ghostLikeStatus === LikeStatus.Liked ? <FontAwesomeIcon className={updatingLikeStatus !== null || updatingLike ? "like-dislike-updating like-button" : "like-button " + cursorHoverClass} icon={faThumbsUpSolid} size="lg" onClick={removeRatingOnClick}/> : <FontAwesomeIcon className={updatingLikeStatus !== null || updatingLike ? "like-dislike-updating like-button" : "like-button " + cursorHoverClass} icon={faThumbsUp} onClick={likeOnClick} size="lg"/>;
    var dislikeButton = ghostLikeStatus === LikeStatus.Disliked ? <FontAwesomeIcon className={updatingLikeStatus !== null || updatingLike ? "like-dislike-updating dislike-button" : "dislike-button " + cursorHoverClass} icon={faThumbsDownSolid} size="lg" onClick={removeRatingOnClick}/> : <FontAwesomeIcon className={updatingLikeStatus !== null || updatingLike ? "like-dislike-updating dislike-button" : "dislike-button " + cursorHoverClass} icon={faThumbsDown} onClick={dislikeOnClick} size="lg"/>;

    var cursedLikeButton = ghostLikeStatus === LikeStatus.Liked ? <img src={cursedPlusOne} className={"cursed-like-dislike cursed-like " + (updatingLikeStatus !== null || updatingLike ? "like-dislike-updating " : "" + cursorHoverClass)} onClick={removeRatingOnClick} ></img> :  <img src={cursedPlusOneUnfilled} className={"cursed-like-dislike cursed-like " + (updatingLikeStatus !== null || updatingLike ? "like-dislike-updating " : " " + cursorHoverClass)} onClick={likeOnClick}></img>;
    var cursedDislikeButton = ghostLikeStatus === LikeStatus.Disliked ? <img src={cursedMinusOne} className={"cursed-like-dislike " + (updatingLikeStatus !== null || updatingLike ? "like-dislike-updating " : "" + cursorHoverClass)} onClick={removeRatingOnClick} ></img> :  <img src={cursedMinusOneUnfilled} className={"cursed-like-dislike " + (updatingLikeStatus !== null || updatingLike ? "like-dislike-updating " : " " + cursorHoverClass)} onClick={dislikeOnClick}></img>;

    const likePercentage = computeTextualLikePercentageRaw(numLikes, numDislikes); // (L + 1) / (L + D + 2) formula to reduce bias

    if (cursed) {
        likeButton = cursedLikeButton;
        dislikeButton = cursedDislikeButton;
    }
    
    if (canLike !== CanRateStatus.CAN_RATE) {
        likeButton = <span className="disabled-like-dislike-buttons">
            {likeButton}
        </span>;
        dislikeButton = <span className="disabled-like-dislike-buttons">
            {dislikeButton}
        </span>;
    }

    likeButton = <span id={"like-" + ratingId}>{likeButton}</span>;
    dislikeButton = <span id={"dislike-" + ratingId}>{dislikeButton}</span>;

    var textualCard =
        <Card className="comment-card">
                <CardHeader>
                    <Row>
                        <Container>
                        <b>{name}</b> {textualDisplayStrings.pastAction} {dateDiffFriendlyFromPresentString(time)} ago
                        </Container> 
                    </Row>
                </CardHeader>
                <CardBody>
                <CardText>{value}</CardText>
                </CardBody>
                <CardFooter>
                    <Row>
                        <Col>
                            <span className="font-weight-light">{context}&nbsp;&nbsp;</span>
                        </Col>
                        <Col className="right-align no-pad mr-10 ml-auto likes-dislikes-col" >
                            <span className="right-align">{likeButton}<label className="like-aggregate text-center no-margin">{likePercentage}%</label>{dislikeButton}</span>
                            {canLike === CanRateStatus.CAN_RATE ? null : 
                                <React.Fragment>
                                    {computeCannotLikeTooltip(true)}
                                    {computeCannotLikeTooltip(false)}
                                </React.Fragment>
                            }
                        </Col>
                    </Row>
                
                </CardFooter>
            </Card>;

    if (myTextual) {
        textualCard =
            <div className="p-3 bg-light my-2 rounded centered">
                <Card body>
                    <CardTitle>
                        <Row>
                        <Col>
                        <h3 className="lead">My {textualDisplayStrings.singular}</h3>
                        </Col>
                        {myTextual ? 
                        <Col xs={3} className="pad-left remove-button ml-auto">
                            <Button className="right-align w-100" color="danger" onClick={remove} disabled={waitingRemove}><Spinner className="spinner-border-sm" hidden={!waitingRemove} /><span hidden={waitingRemove}><FontAwesomeIcon icon={faMinusCircle} size="sm" /></span> Remove</Button>
                        </Col>
                        : null}
                        </Row>
                    </CardTitle>
                    {textualCard}
                </Card>
            </div>
    }

    return (
        textualCard
    );
}