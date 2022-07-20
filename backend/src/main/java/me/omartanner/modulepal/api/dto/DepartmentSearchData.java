package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.h2.model.Department;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DepartmentSearchData {
    private String code;
    private String name;
    private Long numRatings;

    public DepartmentSearchData(Department department) {
        this.code = department.getDepartmentId();
        this.name = department.getName();
        this.numRatings = department.getNumReviewsTotal();
    }
}
