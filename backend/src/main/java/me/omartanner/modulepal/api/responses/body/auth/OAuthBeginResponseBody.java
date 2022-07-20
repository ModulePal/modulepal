package me.omartanner.modulepal.api.responses.body.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthBeginResponseBody {
    private String redirectUrl;
    private String oauthTempToken;
    private Integer authCooldownSeconds;

    public OAuthBeginResponseBody(String redirectUrl, String oauthTempToken) {
        this.redirectUrl = redirectUrl;
        this.oauthTempToken = oauthTempToken;
        this.authCooldownSeconds = null;
    }
}
