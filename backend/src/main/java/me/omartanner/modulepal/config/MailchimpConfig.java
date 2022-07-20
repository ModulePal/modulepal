package me.omartanner.modulepal.config;

import com.ecwid.maleorang.MailchimpClient;
import me.omartanner.modulepal.config.constants.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MailchimpConfig {
    @Bean
    public MailchimpClient createMailchimpClient() {
        return new MailchimpClient(Constants.MAILCHIMP_API_KEY);
    }
}
