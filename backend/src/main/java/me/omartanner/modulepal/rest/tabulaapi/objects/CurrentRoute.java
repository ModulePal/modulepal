package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class CurrentRoute {
    private String code;
    private String name;
    private AdminDepartment adminDepartment;

    public CurrentRoute(String code, String name, AdminDepartment adminDepartment) {
        this.code = code.toUpperCase();
        this.name = name;
        this.adminDepartment = adminDepartment;
    }
}
