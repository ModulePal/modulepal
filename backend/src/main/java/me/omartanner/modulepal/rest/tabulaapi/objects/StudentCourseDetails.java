package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class StudentCourseDetails {
    private String scjCode;
    private String sprCode;
    private String levelCode;
    private LocalDate beginDate;
    private LocalDate endDate;
    private LocalDate expectedEndDate;
    private Integer courseYearLength;
    private Boolean mostSignificant;
    private String reasonForTransferCode;
    private Course course;
    private CurrentRoute currentRoute;
    private Department department;
    private Award award;
    private SitsStatus statusOnRoute;
    private SitsStatus statusOnCourse;
//    private Map<RelationshipType, StudentRelationship> relationships;
    private Set<ModuleRegistration> moduleRegistrations;
    private Set<StudentCourseYear> studentCourseYearDetails;

    public StudentCourseDetails(String scjCode, String sprCode, String levelCode, LocalDate beginDate, LocalDate endDate, LocalDate expectedEndDate, Integer courseYearLength, Boolean mostSignificant, String reasonForTransferCode, Course course, CurrentRoute currentRoute, Department department, Award award, SitsStatus statusOnRoute, SitsStatus statusOnCourse, Set<ModuleRegistration> moduleRegistrations, Set<StudentCourseYear> studentCourseYearDetails) {
        this.scjCode = scjCode.toUpperCase();
        this.sprCode = sprCode.toUpperCase();
        this.levelCode = levelCode.toUpperCase();
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.expectedEndDate = expectedEndDate;
        this.courseYearLength = courseYearLength;
        this.mostSignificant = mostSignificant;
        this.reasonForTransferCode = reasonForTransferCode;
        this.course = course;
        this.currentRoute = currentRoute;
        this.department = department;
        this.award = award;
        this.statusOnRoute = statusOnRoute;
        this.statusOnCourse = statusOnCourse;
        this.moduleRegistrations = moduleRegistrations;
        this.studentCourseYearDetails = studentCourseYearDetails;
    }
}
