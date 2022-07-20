package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class DataLookupErrorResponse<T> extends Response<T> {
    public DataLookupErrorResponse() {
        super(false, 6, null);
    }
}
