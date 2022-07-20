package me.omartanner.modulepal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.format.DateTimeFormatter;

@Configuration
public class DateTimeConfig {
    @Bean(name = "dateFormatter")
    public DateTimeFormatter createGlobalDateFormatter() {
        return DateTimeFormatter.ofPattern("yyyy-MM-dd");
    }

    @Bean(name = "dateTimeFormatter")
    public DateTimeFormatter createGlobalDateTimeFormatter() {
        return DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    }
}
