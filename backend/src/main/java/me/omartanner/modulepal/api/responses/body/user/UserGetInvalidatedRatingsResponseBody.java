package me.omartanner.modulepal.api.responses.body.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.InvalidatedRatingBasicData;

import java.util.List;

@Data
@AllArgsConstructor
public class UserGetInvalidatedRatingsResponseBody {
    private List<InvalidatedRatingBasicData> invalidatedRatings;
}
