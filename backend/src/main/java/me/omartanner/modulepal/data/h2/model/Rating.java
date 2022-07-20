package me.omartanner.modulepal.data.h2.model;

import lombok.NoArgsConstructor;
import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.data.ratingtype.LikeRatingConstants;
import me.omartanner.modulepal.data.ratingtype.RatingType;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(
        name="RATING",
        indexes = {
                @Index(name = "rating_module_index", columnList = "module_id"),
                @Index(name = "rating_grade_index", columnList = "grade"),
                @Index(name = "rating_academic_year_index", columnList = "academic_year"),
                @Index(name = "rating_user_id_index", columnList = "rating_user_id"),
                @Index(name = "rating_uni_user_index", columnList = "rating_uni_user"),
                @Index(name = "rating_legal_index", columnList = "legal"),
                @Index(name = "rating_exists_index", columnList = "rating_exists"),
                @Index(name = "rating_target_rating_id_index", columnList = "target_rating_id"),
                @Index(name = "rating_type_id_index", columnList = "type_id")
        })
@NoArgsConstructor
@Transactional
public class Rating {
    @Id
    @Column(name="rating_id")
    private String ratingId;

    @ManyToOne
    @JoinColumn(name="target_rating_id", nullable=true) // only non-null for LIKE rating types, i.e. the COMMENT or SUGGESTION the user has like
    private Rating targetRating;

    @OneToMany(mappedBy = "targetRating")
    private Set<Rating> childRatings;

    @Column(name="type_id")
    private Integer typeId;

    @Column(name="rating_exists")
    private Boolean ratingPresent;

    @Column(name="time")
    private LocalDateTime time;

    @Column(name="value", columnDefinition = "TEXT", length = Constants.TEXTUAL_MAX_LENGTH)
    private String value;

    @Column(name="academic_year")
    private String academicYear;

    @Column(name="grade")
    private Integer grade;

    @Column(name="rating_user_id")
    private String ratingUserId;

    @ManyToOne
    @JoinColumn(name="module_id", nullable=false)
    private Module module;

    @ManyToOne
    @JoinColumn(name = "rating_uni_user", nullable = true)
    private RatingUniUser ratingUniUser;

    @Column(name="legal", nullable = false)
    private Boolean legal;

    // for non LIKE ratings
    public Rating(String ratingId, Integer typeId, Boolean ratingPresent, LocalDateTime time, String value, String academicYear, Integer grade, Module module, String ratingUserId, RatingUniUser ratingUniUser, Boolean legal) {
        this.ratingId = ratingId;
        this.typeId = typeId;
        this.ratingPresent = ratingPresent;
        this.time = time;
        this.value = value;
        this.academicYear = academicYear;
        this.grade = grade;
        this.module = module;
        this.ratingUserId = ratingUserId;
        this.ratingUniUser = ratingUniUser;
        this.legal = legal;
        this.targetRating = null;
    }

    // for LIKE ratings
    public Rating(String ratingId, Rating targetRating, Boolean ratingPresent, LocalDateTime time, boolean liked, String academicYear, Integer grade, Module module, String ratingUserId, RatingUniUser ratingUniUser, Boolean legal) {
        this.ratingId = ratingId;
        this.typeId = RatingType.LIKE.id();
        this.ratingPresent = ratingPresent;
        this.time = time;
        this.value = liked ? LikeRatingConstants.LIKE_VALUE : LikeRatingConstants.DISLIKE_VALUE;
        this.academicYear = academicYear;
        this.grade = grade;
        this.module = module;
        this.ratingUserId = ratingUserId;
        this.ratingUniUser = ratingUniUser;
        this.legal = legal;
        this.targetRating = targetRating;
    }

    public String getRatingId() {
        return ratingId;
    }

    public void setRatingId(String ratingId) {
        this.ratingId = ratingId;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public Boolean getRatingPresent() {
        return ratingPresent;
    }

    public void setRatingPresent(Boolean ratingPresent) {
        this.ratingPresent = ratingPresent;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public Integer getGrade() {
        return grade;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public String getRatingUserId() {
        return ratingUserId;
    }

    public void setRatingUserId(String ratingUserId) {
        this.ratingUserId = ratingUserId;
    }

    public RatingUniUser getRatingUniUser() {
        return ratingUniUser;
    }

    public void setRatingUniUser(RatingUniUser ratingUniUser) {
        this.ratingUniUser = ratingUniUser;
    }

    public Boolean getLegal() {
        return legal;
    }

    public void setLegal(Boolean legal) {
        this.legal = legal;
    }

    public Rating getTargetRating() {
        return targetRating;
    }

    public void setTargetRating(Rating targetRating) {
        this.targetRating = targetRating;
    }

    public Set<Rating> getChildRatings() {
        return childRatings;
    }

    public void setChildRatings(Set<Rating> childRatings) {
        this.childRatings = childRatings;
    }

    @Override
    public String toString() {
        return "Rating{" +
                "ratingId='" + ratingId + '\'' +
                ", targetRating='" + targetRating + '\'' +
                ", typeId=" + typeId +
                ", ratingPresent=" + ratingPresent +
                ", time=" + time +
                ", value='" + value + '\'' +
                ", academicYear='" + academicYear + '\'' +
                ", grade=" + grade +
                ", module=" + module +
                ", ratingUserId='" + ratingUserId + '\'' +
                ", ratingUniUser=" + ratingUniUser +
                ", legal=" + legal +
                '}';
    }
}
