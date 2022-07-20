package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class RatingAddErrorResponse<T> extends Response<T> {
    public RatingAddErrorResponse(RatingAddError ratingAddError) {
        super(false, ratingAddError.id(), null);
    }
}
