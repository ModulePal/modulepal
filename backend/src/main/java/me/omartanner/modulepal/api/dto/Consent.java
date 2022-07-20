package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Consent {
    private Boolean termsResponse; // if null, not responded
    private Boolean privacyResponse; // if null, not responded
    private Boolean emailResponse; // if null, not responded

    public Consent() {
        this(null, null, null);
    }
}
