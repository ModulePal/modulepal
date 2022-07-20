package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class Module {
    private String code;
    private String name;
    private Boolean active;
    private Department adminDepartment;

    public Module(String code, String name, Boolean active, Department adminDepartment) {
        this.code = code.toUpperCase();
        this.name = name;
        this.active = active;
        this.adminDepartment = adminDepartment;
    }
}
