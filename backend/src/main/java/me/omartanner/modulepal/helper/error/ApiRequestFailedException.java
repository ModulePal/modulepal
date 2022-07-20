package me.omartanner.modulepal.helper.error;

public class ApiRequestFailedException extends RuntimeException {
    public ApiRequestFailedException() {
    }

    public ApiRequestFailedException(String message) {
        super(message);
    }

    public ApiRequestFailedException(String message, Throwable cause) {
        super(message, cause);
    }

    public ApiRequestFailedException(Throwable cause) {
        super(cause);
    }

    public ApiRequestFailedException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
