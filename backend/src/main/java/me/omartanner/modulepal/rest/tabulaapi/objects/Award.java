package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class Award {
    private String code;
    private String name;

    public Award(String code, String name) {
        this.code = code.toUpperCase();
        this.name = name;
    }
}
