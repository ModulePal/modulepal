package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class DataWriteErrorResponse<T> extends Response<T> {
    public DataWriteErrorResponse() {
        super(false, 10, null);
    }
}
