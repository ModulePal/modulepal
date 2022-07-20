package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

import java.util.Set;

@Data
public class Department {
    private String code;
    private String fullName;
    private String name;
    private String shortName;
    private Set<Module> modules;
    private Set<Route> routes;
    private Department parentDepartment;
    private String filter;
    private Set<Department> subDepartments;

    public Department(String code, String fullName, String name, String shortName, Set<Module> modules, Set<Route> routes, Department parentDepartment, String filter, Set<Department> subDepartments) {
        this.code = code.toUpperCase();
        this.fullName = fullName;
        this.name = name;
        this.shortName = shortName;
        this.modules = modules;
        this.routes = routes;
        this.parentDepartment = parentDepartment;
        this.filter = filter;
        this.subDepartments = subDepartments;
    }
}
