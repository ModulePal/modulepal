package me.omartanner.modulepal.rest.coursesapi.objects;

import lombok.Data;

@Data
public class ModuleFullData {
    private String code; // suffixed with -<num cats>
    private String academicYear; // in form yy/yy e.g. 20/21
    private String stemCode; // no -<num cats> suffix e.g. CS118
    private Float creditValue; // number of credits
    private Boolean hideFromPublic;
    private Boolean visibleToStaff;
    private Boolean visibleToStudent;
    private ModuleLeader leader; // lecturer
}
