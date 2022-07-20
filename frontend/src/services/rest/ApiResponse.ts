import { Response } from "./responses/Response";

export interface ApiResponse<T> {
    response: Response<T> | null,
    error: any
}