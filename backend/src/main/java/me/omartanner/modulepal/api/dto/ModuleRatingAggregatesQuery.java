package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.ratingtype.RatingType;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModuleRatingAggregatesQuery {
    private List<RatingType> ratingTypes;

    public boolean valid() {
        if (ratingTypes != null) {
            // check no duplicate rating types
            Set<RatingType> ratingTypeSet = new HashSet<>(ratingTypes);
            return ratingTypeSet.size() == ratingTypes.size();
        }
        return true;
    }
}
