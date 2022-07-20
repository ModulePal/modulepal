package me.omartanner.modulepal.data.h2.model;

import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.transaction.Transactional;

@Entity
@Transactional
@Table(name = "MODULE_LEADER")
@NoArgsConstructor
public class ModuleLeader {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "module_leader_id")
    private Long moduleLeaderId;

    @Column(name = "uniId")
    private String uniId;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name="module")
    private Module module;

    @Column(name = "academicYear")
    private String academicYear;


    public ModuleLeader(String uniId, String name, Module module, String academicYear) {
        this.uniId = uniId;
        this.name = name;
        this.module = module;
        this.academicYear = academicYear;
    }

    public Long getModuleLeaderId() {
        return moduleLeaderId;
    }

    public String getUniId() {
        return uniId;
    }

    public String getName() {
        return name;
    }

    public Module getModule() {
        return module;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setUniId(String uniId) {
        this.uniId = uniId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    @Override
    public String toString() {
        return "ModuleLeader{" +
                "moduleLeaderId='" + moduleLeaderId + '\'' +
                ", uniId='" + uniId + '\'' +
                ", name='" + name + '\'' +
                ", module=" + module +
                ", academicYear='" + academicYear + '\'' +
                '}';
    }
}
