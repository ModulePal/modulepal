package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class InvalidFirebaseTokenIdResponse<T> extends Response<T> {
    public InvalidFirebaseTokenIdResponse() {
        super(false, 1, null);
    }
}
