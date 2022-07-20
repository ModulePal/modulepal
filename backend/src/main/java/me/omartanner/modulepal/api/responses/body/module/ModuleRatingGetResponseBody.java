package me.omartanner.modulepal.api.responses.body.module;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.RatingBasicData;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.data.ratingtype.RatingType;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class ModuleRatingGetResponseBody {
    private List<RatingBasicData> ratings;
}
