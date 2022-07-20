package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.responses.Response;

public class FirebaseAuthErrorResponse<T> extends Response<T> {
    public FirebaseAuthErrorResponse() {
        super(false, 3, null);
    }
}
