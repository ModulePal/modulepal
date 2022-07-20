package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class AdminDepartment {
    private String code;
    private String name;

    public AdminDepartment(String code, String name) {
        this.code = code.toUpperCase();
        this.name = name;
    }
}
