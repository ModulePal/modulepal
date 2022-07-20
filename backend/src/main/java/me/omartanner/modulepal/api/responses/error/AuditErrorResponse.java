package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class AuditErrorResponse<T> extends Response<T> {
    public AuditErrorResponse() {
        super(false, 9, null);
    }
}
