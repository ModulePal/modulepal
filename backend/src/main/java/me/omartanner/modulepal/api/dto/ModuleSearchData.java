package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.h2.model.Module;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModuleSearchData {
    private String code;
    private String name;
    private String departmentCode;
    private String departmentName;
    private Long numRatings;

    public ModuleSearchData(Module module) {
        this.code = module.getModuleId();
        this.name = module.getName();
        this.departmentCode = module.getDepartment().getDepartmentId();
        this.departmentName = module.getDepartment().getName();
        this.numRatings = module.getNumReviewsTotal();
    }
}
