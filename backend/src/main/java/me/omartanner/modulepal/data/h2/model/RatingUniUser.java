package me.omartanner.modulepal.data.h2.model;

import lombok.NoArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "RATING_UNI_USER")
@NoArgsConstructor
@Transactional
public class RatingUniUser {
    @Id
    @Column(name = "uni_id")
    private String uniId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name="anonymous")
    private Boolean anonymous;

    @ManyToOne
    @JoinColumn(name="department_id")
    private Department department;

    @OneToMany(mappedBy = "ratingUniUser")
    private Set<Rating> ratings;

    public RatingUniUser(String uniId, String firstName, String lastName, Department department, Boolean anonymous) {
        this.uniId = uniId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.anonymous = anonymous;
    }

    public String getUniId() {
        return uniId;
    }

    public void setUniId(String uniId) {
        this.uniId = uniId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Boolean getAnonymous() {
        return anonymous;
    }

    public void setAnonymous(Boolean anonymous) {
        this.anonymous = anonymous;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Set<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        this.ratings = ratings;
    }

    @Override
    public String toString() {
        return "RatingContext{" +
                "uniId='" + uniId + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", department=" + department +
                ", anonymous=" + anonymous +
                '}';
    }
}
