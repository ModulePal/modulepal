export interface RatingBasicData {
    ratingId: string,
    ratingType: string,
    time: string,
    value: string,
    academicYear: string,
    grade: string | null,
    moduleCode: string,
    firstName: string | null,
    lastName: string | null,
    departmentCode: string | null,
    departmentName: string | null,
    myRating: boolean,
    targetRatingId: string | null,
    likes : number | null
    dislikes: number | null
}