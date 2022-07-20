package me.omartanner.modulepal.api.responses.body.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.InvalidatedRatingBasicData;

import java.util.List;

@Data
@AllArgsConstructor
public class OAuthUnlinkResponseBody {
    private List<InvalidatedRatingBasicData> invalidatedRatings;
}
