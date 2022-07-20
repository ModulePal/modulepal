package me.omartanner.modulepal.api.responses.body.module;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.ModuleAggregates;

@Data
@AllArgsConstructor
public class ModuleRatingAggregateGetResponseBody {
    private ModuleAggregates moduleAggregates;
}
