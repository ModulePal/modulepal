package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class DataNotExistsResponse<T> extends Response<T> {
    public DataNotExistsResponse() {
        super(false, 4, null);
    }
}
