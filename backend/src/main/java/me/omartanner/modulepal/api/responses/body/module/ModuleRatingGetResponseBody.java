package me.omartanner.modulepal.api.responses.body.module;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.RatingBasicData;

import java.util.List;

@Data
@AllArgsConstructor
public class ModuleRatingGetResponseBody {
    private List<RatingBasicData> ratings;
}
