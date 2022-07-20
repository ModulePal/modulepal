package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class StudentCourseYear {
    private String academicYear;
    private Long sceSequenceNumber;
    private Long yearOfStudy;
    private String studyLevel;
    private Boolean casUsed;
    private Boolean tier4Visa;
    private Route route;
    private EnrolmentStatus enrolmentStatus;
    private Department enrolmentDepartment;
    private ModeOfAttendence modeOfAttendance;

    public StudentCourseYear(String academicYear, Long sceSequenceNumber, Long yearOfStudy, String studyLevel, Boolean casUsed, Boolean tier4Visa, Route route, EnrolmentStatus enrolmentStatus, Department enrolmentDepartment, ModeOfAttendence modeOfAttendance) {
        this.academicYear = academicYear;
        this.sceSequenceNumber = sceSequenceNumber;
        this.yearOfStudy = yearOfStudy;
        this.studyLevel = studyLevel;
        this.casUsed = casUsed;
        this.tier4Visa = tier4Visa;
        this.route = route;
        this.enrolmentStatus = enrolmentStatus;
        this.enrolmentDepartment = enrolmentDepartment;
        this.modeOfAttendance = modeOfAttendance;
    }
}
