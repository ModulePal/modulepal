package me.omartanner.modulepal.data.h2.model;

import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Id;

@NoArgsConstructor
public class Route {
    @Id
    @Column(name="route_id")
    private String routeId;

    @Column(name="name")
    private String name;

    @Column(name="degree_type")
    private String degreeType;

    public Route(String routeId, String name, String degreeType) {
        this.routeId = routeId;
        this.name = name;
        this.degreeType = degreeType;
    }

    public String getRouteId() {
        return routeId;
    }

    public void setRouteId(String routeId) {
        this.routeId = routeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDegreeType() {
        return degreeType;
    }

    public void setDegreeType(String degreeType) {
        this.degreeType = degreeType;
    }

//    public Set<Department> getDepartments() {
//        return departments;
//    }
//
//    public void setDepartments(Set<Department> departments) {
//        this.departments = departments;
//    }

    @Override
    public String toString() {
        return "Route{" +
                "routeId='" + routeId + '\'' +
                ", name='" + name + '\'' +
                ", degreeType='" + degreeType + '\'' +
                '}';
    }
}
