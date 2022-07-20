package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UniUserBasicData {
    private String uniId;
    private String firstName;
    private String lastName;
    private String email;
    private DepartmentBasicData department;
    private Boolean gotModuleData;
    private Boolean anonymous;
}
