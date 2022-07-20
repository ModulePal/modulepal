package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModuleRegistration {
    private String uniId;
    private String moduleCode;
    private String moduleName;
    private String academicYear;
    // Float mark;
    // private Grade grade;
    private Integer numReviews;

//    public ModuleRegistration(ModuleRegistrationBasicData moduleRegistrationBasicData, String moduleName, Integer numRatings) throws NumberFormatException {
//        this.uniId = moduleRegistrationBasicData.getU();
//        this.moduleCode = moduleRegistrationBasicData.getM();
//        this.academicYear = moduleRegistrationBasicData.getY();
//        this.mark = moduleRegistrationBasicData.getP() == null ? null : Float.parseFloat(moduleRegistrationBasicData.getP());
//        this.grade = moduleRegistrationBasicData.getG() == null ? null : Grade.fromId(moduleRegistrationBasicData.getG());
//        this.moduleName = moduleName;
//        this.numRatings = numRatings;
//    }
}
