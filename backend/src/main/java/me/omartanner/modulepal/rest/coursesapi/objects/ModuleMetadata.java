package me.omartanner.modulepal.rest.coursesapi.objects;

import lombok.Data;

@Data
public class ModuleMetadata {
    private String code; // suffixed with -<number of cats> e.g. CS118-15
    private String academicYear; // in form 4 digits e.g. 2020

    public ModuleMetadata(String code, String academicYear) {
        this.code = code;
        this.academicYear = academicYear;
    }
}
