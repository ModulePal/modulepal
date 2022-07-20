package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class ModuleRegistration {
    private Module module;
    private Double cats;
    private String academicYear;
    private String assessmentGroup;
    private String occurrence;
    private Double mark;
    private String grade;
    private String status;

    public ModuleRegistration(Module module, Double cats, String academicYear, String assessmentGroup, String occurrence, Double mark, String grade, String status) {
        this.module = module;
        this.cats = cats;
        this.academicYear = academicYear;
        this.assessmentGroup = assessmentGroup;
        this.occurrence = occurrence;
        this.mark = mark;
        this.grade = grade;
        this.status = status;
    }
}
