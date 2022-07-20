package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class Course {
    private String code;
    private String name;
    private String type;

    public Course(String code, String name, String type) {
        this.code = code.toUpperCase();
        this.name = name;
        this.type = type;
    }
}
