package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

import java.util.Set;

@Data
public class Member {
    private String universityId;
    private String userId;
    private String firstName;
    private String fullFirstName;
    private String lastName;
    private String email;
    private String fullName;
    private String officialName;
    private Department homeDepartment;
    private Set<StudentCourseDetails> studentCourseDetails;
}
