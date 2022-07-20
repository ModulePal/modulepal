package me.omartanner.modulepal.api.responses.body.module;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.omartanner.modulepal.api.dto.ModuleBasicData;
import me.omartanner.modulepal.api.dto.ModuleLeader;
import me.omartanner.modulepal.api.dto.ModuleReviewCount;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class ModuleMetadataResponseBody {
    private ModuleBasicData moduleBasicData;
    private List<String> academicYears;
    private List<ModuleLeader> leaders;
    private Long numReviews;
}
