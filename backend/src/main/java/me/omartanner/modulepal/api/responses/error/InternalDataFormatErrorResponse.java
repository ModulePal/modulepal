package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class InternalDataFormatErrorResponse<T> extends Response<T> {
    public InternalDataFormatErrorResponse() {
        super(false, 7, null);
    }
}
