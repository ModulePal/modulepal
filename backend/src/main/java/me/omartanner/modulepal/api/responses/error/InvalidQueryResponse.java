package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class InvalidQueryResponse<T> extends Response<T> {
    public InvalidQueryResponse() {
        super(false, 5, null);
    }
}
