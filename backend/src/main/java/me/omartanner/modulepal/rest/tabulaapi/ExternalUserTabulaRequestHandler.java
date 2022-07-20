package me.omartanner.modulepal.rest.tabulaapi;

import me.omartanner.modulepal.rest.ApiResponse;
import me.omartanner.modulepal.rest.RequestHandler;
import okhttp3.OkHttpClient;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

public class ExternalUserTabulaRequestHandler extends RequestHandler {
    private static final String BASE_URL = "https://tabula.warwick.ac.uk/api/";
    private String httpAuthorizationHeaderValue;

    public ExternalUserTabulaRequestHandler(String httpAuthorizationHeaderValue, String versionTag, OkHttpClient okHttpClient) {
        super(BASE_URL + versionTag + "/", okHttpClient);
        this.httpAuthorizationHeaderValue = httpAuthorizationHeaderValue;
    }

    public <T extends me.omartanner.modulepal.rest.tabulaapi.response.Response> ApiResponse<T> makeGetRequest(String endpoint, Class<T> responseClass) throws IOException {
        return makeGetRequest(endpoint, Collections.emptyMap(), responseClass);
    }

    public <T extends me.omartanner.modulepal.rest.tabulaapi.response.Response> ApiResponse<T> makeGetRequest(String endpoint, Map<String, String> queryParams, Class<T> responseClass) throws IOException {
        return super.makeGetRequest(endpoint, queryParams, responseClass, "application/json", httpAuthorizationHeaderValue);
    }

}
