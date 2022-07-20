package me.omartanner.modulepal.data.h2.model;

import lombok.NoArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="DEPARTMENT",
        indexes = {
                @Index(name = "department_name_index", columnList = "name"),
                @Index(name = "department_num_reviews_total_index", columnList = "num_reviews_total")
        })
@NoArgsConstructor
@Transactional
public class Department {
    @Id
    @Column(name="department_id")
    private String departmentId;

    @Column(name="name")
    private String name;

    @OneToMany(mappedBy = "department", fetch = FetchType.EAGER)
    private List<Module> modules = new ArrayList<>();

//    @ManyToMany(mappedBy = "departments")
//    private Set<Route> routes;

    @OneToMany(mappedBy = "department")
    private Set<RatingUniUser> ratingContexts;

    @Column(name="num_reviews_total")
    private Long numReviewsTotal;

    @Column(name="num_reviews_users")
    private Long numReviewsUsers;

    public Department(String departmentId, String name) {
        this(departmentId, name, (long) 0, (long) 0);
    }

    public Department(String departmentId, String name, Long numReviewsTotal, Long numReviewsUsers) {
        this.departmentId = departmentId;
        this.name = name;
        this.numReviewsTotal = numReviewsTotal;
        this.numReviewsUsers = numReviewsUsers;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Module> getModules() {
        return modules;
    }

    public void setModules(List<Module> modules) {
        this.modules = modules;
    }

//    public Set<Route> getRoutes() {
//        return routes;
//    }
//
//    public void setRoutes(Set<Route> routes) {
//        this.routes = routes;
//    }

    public Set<RatingUniUser> getRatingContexts() {
        return ratingContexts;
    }

    public void setRatingContexts(Set<RatingUniUser> ratingContexts) {
        this.ratingContexts = ratingContexts;
    }

    public Long getNumReviewsTotal() {
        return numReviewsTotal;
    }

    public void setNumReviewsTotal(Long rank) {
        this.numReviewsTotal = rank;
    }

    public Long getNumReviewsUsers() {
        return numReviewsUsers;
    }

    public void setNumReviewsUsers(Long numReviewsUsers) {
        this.numReviewsUsers = numReviewsUsers;
    }

    @Override
    public String toString() {
        return "Department{" +
                "departmentId='" + departmentId + '\'' +
                ", name='" + name + '\'' +
                ", numReviewsTotal='" + numReviewsTotal + '\'' +
                ", numReviewsUsers='" + numReviewsUsers + '\'' +
                '}';
    }

    @Transactional
    public void addModule(Module module) {
        modules.add(module);
    }
}
