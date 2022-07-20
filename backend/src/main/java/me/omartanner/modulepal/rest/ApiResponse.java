package me.omartanner.modulepal.rest;

public class ApiResponse<T> {
    private int code;
    private T body;

    public ApiResponse(int code, T body) {
        this.code = code;
        this.body = body;
    }

    public int getCode() {
        return code;
    }

    public T getBody() {
        return body;
    }
}
