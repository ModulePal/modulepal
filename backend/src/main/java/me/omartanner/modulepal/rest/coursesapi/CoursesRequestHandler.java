package me.omartanner.modulepal.rest.coursesapi;

import me.omartanner.modulepal.rest.ApiResponse;
import me.omartanner.modulepal.rest.RequestHandler;
import okhttp3.OkHttpClient;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

public class CoursesRequestHandler extends RequestHandler {
    private static final String BASE_URL = "https://courses.warwick.ac.uk";

    public CoursesRequestHandler(OkHttpClient okHttpClient) {
        super(BASE_URL, okHttpClient);
    }

    public <T> ApiResponse<T> makeGetRequest(String endpoint, Map<String, String> queryParams, Type responseType) throws IOException {
        return super.makeGetRequest(endpoint, queryParams, responseType, "application/json", null);
    }
}
