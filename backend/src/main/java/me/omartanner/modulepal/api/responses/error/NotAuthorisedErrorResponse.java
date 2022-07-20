package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class NotAuthorisedErrorResponse<T> extends Response<T> {
    public NotAuthorisedErrorResponse() {
        super(false, 8, null);
    }
}
