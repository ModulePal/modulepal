package me.omartanner.modulepal.data.h2.model;

import lombok.NoArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name="MODULE",
       indexes = {
            @Index(name = "module_name_index", columnList = "name"),
            @Index(name = "module_active_index", columnList = "active"),
            @Index(name = "module_department_index", columnList = "department_id"),
               @Index(name = "module_num_reviews_total_index", columnList = "num_reviews_total")
       })
@NoArgsConstructor
@Transactional
public class Module {
    @Id
    @Column(name="module_id")
    private String moduleId;

    @Column(name="name")
    private String name;

    @Column(name="active")
    private Boolean active;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="department_id", nullable=false)
    private Department department;

    @OneToMany(mappedBy = "module")
    private Set<Rating> ratings;

    @OneToMany(mappedBy = "module")
    private Set<ModuleLeader> leaders;

    @Column(name="num_reviews_total")
    private Long numReviewsTotal;

    @Column(name="num_reviews_users")
    private Long numReviewsUsers;

    public Module(String moduleId, String name, Boolean active, Department department, Long numReviewsTotal, Long numReviewsUsers) {
        this.moduleId = moduleId;
        this.name = name;
        this.active = active;
        this.department = department;
        this.numReviewsTotal = numReviewsTotal;
        this.numReviewsUsers = numReviewsUsers;
    }

    public Module(String moduleId, String name, Boolean active, Department department) {
        this(moduleId, name, active, department, (long) 0, (long) 0);
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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

    public Long getNumReviewsTotal() {
        return numReviewsTotal;
    }

    public Long getNumReviewsUsers() {
        return numReviewsUsers;
    }

    public void setNumReviewsUsers(Long numReviewsUsers) {
        this.numReviewsUsers = numReviewsUsers;
    }

    public void setNumReviewsTotal(Long numReviewsTotal) {
        this.numReviewsTotal = numReviewsTotal;
    }

    public Set<ModuleLeader> getLeaders() {
        return leaders;
    }

    public void setLeaders(Set<ModuleLeader> leaders) {
        this.leaders = leaders;
    }

    @Override
    public String toString() {
        return "Module{" +
                "moduleId='" + moduleId + '\'' +
                ", name='" + name + '\'' +
                ", active=" + active +
                ", department=" + department +
                ", numReviewsTotal=" + numReviewsTotal +
                ", numReviewsUsers=" + numReviewsUsers +
                '}';
    }
}

