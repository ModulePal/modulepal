package me.omartanner.modulepal.api.responses.body.module;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.ModuleSearchData;

import java.util.List;

@Data
@AllArgsConstructor
public class ModuleSearchResponseBody {
    private List<ModuleSearchData> modules;
}
