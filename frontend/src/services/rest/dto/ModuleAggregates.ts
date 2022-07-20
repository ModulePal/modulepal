import { RatingTypeAggregates } from "./RatingTypeAggregates";

export interface ModuleAggregates {
    ratingTypeAggregates: Record<string, RatingTypeAggregates>
}