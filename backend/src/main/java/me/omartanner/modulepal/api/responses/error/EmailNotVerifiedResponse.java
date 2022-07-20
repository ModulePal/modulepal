package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class EmailNotVerifiedResponse<T> extends Response<T> {
    public EmailNotVerifiedResponse() {
        super(false, 2, null);
    }
}
