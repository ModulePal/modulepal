package me.omartanner.modulepal.config;

import me.omartanner.modulepal.config.constants.Constants;
import me.omartanner.modulepal.rest.tabulaapi.ExternalUserTabulaRequestHandler;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ExternalTabulaRequestHandlerConfig {
    @Autowired
    OkHttpClient okHttpClient;

    @Bean
    public ExternalUserTabulaRequestHandler createExternalTabulaRequestHandler() {
        return new ExternalUserTabulaRequestHandler(Constants.TABULA_API_HTTP_AUTH_HEADER_VALUE, Constants.TABULA_API_VERSION_TAG, okHttpClient);
    }
}
