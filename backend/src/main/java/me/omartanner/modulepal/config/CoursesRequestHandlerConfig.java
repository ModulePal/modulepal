package me.omartanner.modulepal.config;

import me.omartanner.modulepal.rest.coursesapi.CoursesRequestHandler;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoursesRequestHandlerConfig {
    @Autowired
    OkHttpClient okHttpClient;

    @Bean
    public CoursesRequestHandler createCoursesRequestHandler() {
        return new CoursesRequestHandler(okHttpClient);
    }

}
