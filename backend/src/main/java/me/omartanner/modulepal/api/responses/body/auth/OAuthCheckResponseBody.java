package me.omartanner.modulepal.api.responses.body.auth;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.api.dto.Consent;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthCheckResponseBody {
    private Integer authCooldownSeconds;
    private Consent consent;
}
