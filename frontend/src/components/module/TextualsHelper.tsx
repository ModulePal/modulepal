import { RatingBasicData } from "../../services/rest/dto/RatingBasicData";
import { TEXTUAL_RATING_TYPES } from "../../services/rest/api";
import { displayPartsToString } from "typescript";

export function computeTextualLikePercentage(ratingBasicData: RatingBasicData): number | null {
    if (!ratingBasicData.ratingType || !TEXTUAL_RATING_TYPES.find(type => type === ratingBasicData.ratingType)) {
        return null;
    }
    const likes = ratingBasicData.likes ?? 0;
    const dislikes = ratingBasicData.dislikes ?? 0;
    return computeTextualLikePercentageRaw(likes, dislikes);
}

export function computeTextualLikePercentageRaw(likes: number, dislikes: number): number | null {
    const numerator = likes + 1;
    const denominator = likes + dislikes + 2;
    if (denominator === 0) return null;
    return Math.floor(100 * ((likes + 1) / (likes + dislikes + 2)));
}