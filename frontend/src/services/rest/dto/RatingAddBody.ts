import { RatingAddData } from "./RatingAddData";

export interface RatingAddBody {
    removeRatingId: string | null,
    moduleCode: string,
    newRatings: RatingAddData[]
}