import React, { useContext, useState, useEffect } from "react";
import { AcademicYear, ModuleMetadataContext, parseAcademicYear } from "./context/ModuleMetadataContext";
import { AuthContext, authorisedUser } from "../../services/firebase/AuthStore";
import { RatingBasicData } from "../../services/rest/dto/RatingBasicData";
import { LikeStatus, ModuleTextualComponent } from "./ModuleTextualComponent";
import { SpinnerComponent } from "../SpinnerComponent";
import { Container, Row, Alert, Toast, ToastHeader, ToastBody, Card, CardTitle, CardBody } from "reactstrap";
import { string } from "prop-types";
import { TextualDisplaySettingsComponent } from "./TextualDisplaySettingsComponent";
import { AddTextualComponent } from "./AddTextualComponent";
import { getErrorResponse, ErrorTypeApiResponse } from "../../services/rest/error";
import { addRating, API_DISLIKE_VALUE, API_LIKE_VALUE, removeRating } from "../../services/rest/api";
import { ModuleMyAcademicDataContext } from "./context/ModuleMyAcademicDataContext";
import { CurrentUserDataContext } from "../../services/rest/CurrentUserDataStore";
import { LoadingComponent } from "../LoadingComponent";
import { SelectedModuleContext } from "../context/SelectedModuleContext";
import { ModuleTextualDataFunctional, TextualDisplayStrings } from "./context/ModuleTextualContext";
import { ModuleMyRatingsContext } from "./context/ModuleMyRatingsContext";

export interface Props {
    academicYear: AcademicYear | null,
    textualContext: React.Context<ModuleTextualDataFunctional>,
    textualDisplayStrings: TextualDisplayStrings,
    textualApiString: string
}

export interface TextualFeedback {
    message: JSX.Element,
    update: boolean,
    color: string
}

const feedbackDuration = 5000;


export const ModuleTextualsComponent: React.FC<Props> = ({ academicYear, textualContext, textualDisplayStrings, textualApiString }) => {
    const moduleTextualsContext = useContext(textualContext);
    const moduleContext = useContext(SelectedModuleContext);
    const currentUser = useContext(AuthContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);
    const moduleMyAcademicDataContext = useContext(ModuleMyAcademicDataContext);
    const moduleMetadataContext = useContext(ModuleMetadataContext);

    const [dummyState, setDummyState] = useState<boolean>(true);

    const [updatingLike, setUpdatingLike] = useState<boolean>(false);

    // const moduleMyRatingsContext = useContext(ModuleMyRatingsContext); // for the likes/dislikes
    
    const [feedback, setFeedback] = useState<TextualFeedback | null>(null);
    const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);
    const [updatingTextuals, setUpdatingTextuals] = useState(false);

    async function feedbackHandler(newFeedback: TextualFeedback) {
        if (newFeedback.update) {
            await updateTextuals(false);
            moduleMetadataContext.updateMetadata(true); // update academic years
        }
        setFeedbackBriefly(newFeedback);
    }

    function setFeedbackBriefly(newFeedback: TextualFeedback) {
        if (!!feedbackTimeout) {
            clearTimeout(feedbackTimeout);
            setFeedbackTimeout(null);
        }
        setFeedback(newFeedback);
        setFeedbackTimeout(setTimeout(() => {setFeedback(null); setFeedbackTimeout(null)}, feedbackDuration));
    }

    async function updateTextuals(showLoader: boolean = true) {
        if (showLoader) setUpdatingTextuals(true);
        const result = await moduleTextualsContext.updateTextuals(null, !!academicYear ? [academicYear.raw] : null, false, true);
        if (!result) {
            feedbackHandler({
                message: <span>Failed to update {textualDisplayStrings.plural}. Please refresh the page, and if the issue perists please report it.</span>,
                update: false,
                color: "danger"
            });
            if (showLoader) setUpdatingTextuals(false);
            return;
        }
        const errorResponse1 = getErrorResponse(result[0]);
        const errorResponse2 = getErrorResponse(result[1]);
        if (!!errorResponse1 || !!errorResponse2) {
            const errorResponse = !!errorResponse1 ? errorResponse1 : errorResponse2;
            feedbackHandler({
                message: <span>{errorResponse!!.info.decoratedFriendlyErrorMessage}</span>,
                update: false,
                color: "danger"
            });
        }
        if (showLoader) setUpdatingTextuals(false);
    }

    useEffect(() => {
        updateTextuals();
    }, [moduleContext, academicYear, textualApiString]);

    if (updatingTextuals) {
        return(
            <React.Fragment>
                <div className="mt-3 centered justify-content-center">
                <SpinnerComponent />
                </div>
            </React.Fragment>
        );
    }

    async function handleRemove(ratingId: string, academicYearRaw: string) {
        var feedback = {
            message: <span>Successfully removed {textualDisplayStrings.singular}.</span>,
            update: true,
            color: "info"
        };
        if (authorisedUser(currentUser)) {
            const response = await removeRating(currentUser.idToken!!, ratingId);
            const errorApiResponse = getErrorResponse(response);
            if (!errorApiResponse) { // successfully removed
                moduleTextualsContext.removeTextual(ratingId);
                // update dashboard and void external sessions
                await currentUserDataContext.modifyModuleReviewsCount(false, moduleContext.moduleCode!!, academicYearRaw, currentUser.idToken!!);
            }
            else {
                feedback = {
                    message: <span>{errorApiResponse.info.decoratedFriendlyErrorMessage}</span>,
                    update: false,
                    color: "danger"
                };
            }
        }
        feedbackHandler(feedback);
    }

    var textuals: RatingBasicData[] = [];

    if (!!moduleTextualsContext.myTextualsIds && !!moduleTextualsContext.textualRatings) {
        const myTextualIds = moduleTextualsContext.myTextualsIds;
        const sortedTextuals = moduleTextualsContext.sortedTextuals;
        const textualRatings = moduleTextualsContext.textualRatings;
        myTextualIds.forEach(textualId => {
            const textualBasicData = textualRatings[textualId];
            if (!!textualBasicData && !!sortedTextuals && sortedTextuals.some(textual => textual.ratingId === textualId)) {
                textuals.push(textualBasicData);
            }
        });
        if (!!sortedTextuals) {
            sortedTextuals.forEach(textual => {
                if (!!textual) {
                    if (!textual.myRating) {
                        textuals.push(textual);
                    }
                }
            });
        }
    }

    const gotMyTextual = !!moduleTextualsContext.myTextualsIds && moduleTextualsContext.myTextualsIds.length === 1;

    function computeLikedRatings(liked: boolean): Record<string, string> { // returns a map with key the rating id that was liked, and value the rating id that is like like itself
        var likedRatings: Record<string, string> = {};
        if (!moduleTextualsContext || !moduleTextualsContext.myLikes) {
            return {};
        }
        moduleTextualsContext.myLikes.forEach(likeMetadata => {
            if ((liked && likeMetadata.liked) || (!liked && !likeMetadata.liked)) {
                likedRatings[likeMetadata.targetRatingId] = likeMetadata.ratingId;
            }
        });
        return likedRatings;
    }

    const likedRatings = computeLikedRatings(true);
    const dislikedRatings = computeLikedRatings(false);

    function computeLikeStatus(ratingId: string): LikeStatus { // returns whether the user liked this rating id
        return !!likedRatings[ratingId] ? LikeStatus.Liked : (!!dislikedRatings[ratingId] ? LikeStatus.Disliked : LikeStatus.None);
    }

    async function handleLike(ratingId: string, academicYearRaw: string, newLikeStatus: LikeStatus) {
        if (!authorisedUser(currentUser)) return;
        if (updatingLike) return;
        setUpdatingLike(true);

        var currentLikeStatus = computeLikeStatus(ratingId);
        const currentLikeRatingId = likedRatings[ratingId] ?? dislikedRatings[ratingId] ?? null;

        if (newLikeStatus === currentLikeStatus) {
            setUpdatingLike(false);
            return;
        }
        
        setDummyState(!dummyState);

        const removeThenAdd = currentLikeStatus !== LikeStatus.None && newLikeStatus !== LikeStatus.None;

        const onlyRemove = currentLikeStatus !== LikeStatus.None && newLikeStatus === LikeStatus.None;
        const onlyAdd = currentLikeStatus === LikeStatus.None && newLikeStatus !== LikeStatus.None;

            
        var likesDelta = 0;
        var dislikesDelta = 0;

        // UPDATE LIKE COUNTS
        if (removeThenAdd) {
            if (currentLikeStatus === LikeStatus.Liked) { // removed like then added dislike
                likesDelta = -1;
                dislikesDelta = 1;
            }
            else { // removed dislike then added like
                dislikesDelta = -1;
                likesDelta = 1;
            }
        }
        else if (onlyRemove) {
            if (currentLikeStatus === LikeStatus.Liked) { // removed like
                likesDelta = -1;
            }
            else { // removed dislike
                dislikesDelta = -1;
            }
        }
        else if (onlyAdd) {
            if (newLikeStatus === LikeStatus.Liked) { // added like
                likesDelta = 1;
            }
            else { // added dislike
                dislikesDelta = 1;
            }
        }

        function updateLikeCounts(add: boolean) {
            const multiplier = add ? 1 : -1;
            if (likesDelta !== 0) moduleTextualsContext.updateRatingIdLikes(ratingId, true, multiplier * likesDelta);
            if (dislikesDelta !== 0) moduleTextualsContext.updateRatingIdLikes(ratingId, false, multiplier * dislikesDelta);
        }

        updateLikeCounts(true);
        
        // MAKE API REQUEST TO UPDATE LIKES ON SERVER

        if (removeThenAdd) {
            const response = await addRating(
                currentUser.idToken!!,
                {
                    removeRatingId: currentLikeRatingId,
                    moduleCode: moduleContext.moduleCode!!,
                    newRatings: [
                        {
                            type: "LIKE",
                            value: newLikeStatus === LikeStatus.Liked ? API_LIKE_VALUE : API_DISLIKE_VALUE,
                            academicYear: academicYearRaw,
                            targetRatingId: ratingId
                        }
                    ]
                }
            );
            const errorResponse = getErrorResponse(response);
            if (!!errorResponse) {
                updateLikeCounts(false); // revert like counts
                setDummyState(!dummyState);
                feedbackHandler({
                    message: <span>{errorResponse.info.decoratedFriendlyErrorMessage}</span>,
                    update: false,
                    color: "danger"
                });
                setUpdatingLike(false);
                return;
            }
            if (!!response.response && !!response.response.body.newRatingIds && !!response.response.body.newRatingIds[0]) {
                const likeMetadata = {
                    liked: newLikeStatus === LikeStatus.Liked,
                    ratingId: response.response?.body.newRatingIds[0],
                    targetRatingId: ratingId
                };
                moduleTextualsContext.replaceLikeRating(currentLikeRatingId, likeMetadata);
            }
        }
        else if (onlyAdd) {
            const response = await addRating(
                currentUser.idToken!!,
                {
                    removeRatingId: null,
                    moduleCode: moduleContext.moduleCode!!,
                    newRatings: [
                        {
                            type: "LIKE",
                            value: newLikeStatus === LikeStatus.Liked ? API_LIKE_VALUE : API_DISLIKE_VALUE,
                            academicYear: academicYearRaw,
                            targetRatingId: ratingId
                        }
                    ]
                }
            );
            const errorResponse = getErrorResponse(response);
            if (!!errorResponse) {
                updateLikeCounts(false); // revert like counts
                setDummyState(!dummyState);
                feedbackHandler({
                    message: <span>{errorResponse.info.decoratedFriendlyErrorMessage}</span>,
                    update: false,
                    color: "danger"
                });
                setUpdatingLike(false);
                return;
            }
            if (!!response.response && !!response.response.body.newRatingIds && !!response.response.body.newRatingIds[0]) {
                const likeMetadata = {
                    liked: newLikeStatus === LikeStatus.Liked,
                    ratingId: response.response?.body.newRatingIds[0],
                    targetRatingId: ratingId
                };
                moduleTextualsContext.addLikeRating(likeMetadata);
            }
        }
        else if (onlyRemove) {
            const response = await removeRating(currentUser.idToken!!, currentLikeRatingId);
            const errorResponse = getErrorResponse(response);
            if (!!errorResponse) {
                updateLikeCounts(false); // revert like counts
                setDummyState(!dummyState);
                feedbackHandler({
                    message: <span>{errorResponse.info.decoratedFriendlyErrorMessage}</span>,
                    update: false,
                    color: "danger"
                });
                setUpdatingLike(false);
                return;
            }
            moduleTextualsContext.removeLikeRating(currentLikeRatingId);
        }

        setUpdatingLike(false);
        // success.
    }

    return (
        <React.Fragment>
            <Container className="mt-3">
                <Alert hidden={!feedback} color={feedback?.color} className="mt-5 comment-card centered text-center">{feedback?.message}</Alert>
                <div className="mb-3"></div>
                {(gotMyTextual || !currentUser.user || (!currentUser.user.emailVerified && !currentUser.anonymous)) ? null : <AddTextualComponent feedbackHandler={feedbackHandler} academicYear={academicYear} textualDisplayStrings={textualDisplayStrings} textualApiString={textualApiString} />}
                {textuals.map(textual => {
                    if (!textual.academicYear) {
                        return null;
                    }
                    const academicYearObj = parseAcademicYear(textual.academicYear);
                    if (!academicYearObj) {
                        return null;
                    }
                    if (!textual.grade) {
                        return null;
                    }
                    var element = 
                        <React.Fragment key={textual.ratingId}>
                            <div className="centered">
                                <ModuleTextualComponent ratingId={textual.ratingId} moduleCode={moduleContext.moduleCode!!} academicYear={academicYearObj} time={textual.time} value={textual.value} grade={textual.grade} firstName={textual.firstName} lastName={textual.lastName} departmentCode={textual.departmentCode} departmentName={textual.departmentName} myTextual={textual.myRating} numLikes={textual.likes ?? 0} numDislikes={textual.dislikes ?? 0} handleRemove={handleRemove} textualDisplayStrings={textualDisplayStrings} likeStatus={computeLikeStatus(textual.ratingId)} handleLike={handleLike} updatingLike={updatingLike} canLike={moduleMyAcademicDataContext.canRateInAcademicYear(academicYearObj)} cursed={currentUserDataContext.cursed} ></ModuleTextualComponent>
                            </div>
                        </React.Fragment>;
                    
                    return <Row className="mb-3" key={textual.ratingId}>{element}</Row>;
                })}
            </Container>
        </React.Fragment>
        
    );
}