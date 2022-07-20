package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class ModeOfAttendence {
    private String code;
    private String name;

    public ModeOfAttendence(String code, String name) {
        this.code = code.toUpperCase();
        this.name = name;
    }
}
