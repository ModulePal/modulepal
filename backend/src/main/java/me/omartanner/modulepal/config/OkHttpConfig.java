package me.omartanner.modulepal.config;

import okhttp3.OkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OkHttpConfig {
    @Bean
    public OkHttpClient createOkHttpClient() {
        return new OkHttpClient();
    }
}
