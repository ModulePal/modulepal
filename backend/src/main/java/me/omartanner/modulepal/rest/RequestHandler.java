package me.omartanner.modulepal.rest;

import me.omartanner.modulepal.helper.json.Deserializer;
import okhttp3.*;

import javax.sound.midi.SysexMessage;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

public class RequestHandler {
    private String baseUrl;
    private OkHttpClient okHttpClient;

    public RequestHandler(String baseUrl, OkHttpClient okHttpClient) {
        this.baseUrl = baseUrl;
        this.okHttpClient = okHttpClient;
    }

    private Response makeGetRequest(String endpoint, Map<String, String> queryParams, String contentType, String authorizationHeader) throws IOException {
        HttpUrl noParamUrl = HttpUrl.parse(baseUrl + endpoint);
        if (noParamUrl == null) {
            throw new IOException("Failed to parse no parameter URL.");
        }
        HttpUrl.Builder urlBuilder = noParamUrl.newBuilder();
        for(Map.Entry<String, String> queryParam : queryParams.entrySet()) {
            String param = queryParam.getKey();
            String value = queryParam.getValue();
            urlBuilder.addQueryParameter(param, value);
        }
        String url = urlBuilder.build().toString();
        Request.Builder requestBuilder = new Request.Builder()
                .url(url);
        if (contentType != null) requestBuilder = requestBuilder.addHeader("Content-Type", contentType).addHeader("Accept", contentType);
        if (authorizationHeader != null) requestBuilder = requestBuilder.addHeader("Authorization", authorizationHeader);
        Request request = requestBuilder.build();
        Call call = okHttpClient.newCall(request);
        Response response = call.execute();
        return response;
    }

    protected <T> ApiResponse<T> makeGetRequest(String endpoint, Map<String, String> queryParams, Type responseType, String contentType, String authorizationHeader) throws IOException {
        Response response = makeGetRequest(endpoint, queryParams, contentType, authorizationHeader);
        ResponseBody responseBody = response.body();
        T body = responseBody == null ? null : Deserializer.deserialize(responseBody.string(), responseType);
        return new ApiResponse<>(response.code(), body);
    }
}
