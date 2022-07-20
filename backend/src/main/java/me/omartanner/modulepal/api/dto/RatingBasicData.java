package me.omartanner.modulepal.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.data.ratingtype.RatingType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RatingBasicData {
    private String ratingId;
    private RatingType ratingType;
    private LocalDateTime time;
    private String value;
    private String academicYear;
    private Grade grade;
    private String moduleCode;
    private String firstName;
    private String lastName;
    private String departmentCode;
    private String departmentName;
    private Boolean myRating;
    private String targetRatingId;
    private Integer likes; // total number of likes, for textual ratings
    private Integer dislikes; // total number of dislikes, for textual ratings
}
