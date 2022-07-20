export interface ModuleRatingsQuery {
    moduleCode: string,
    grades: string[] | null
    academicYears: string[] | null
    ratingTypes: string[] | null
    onlyMyRatings: boolean
}