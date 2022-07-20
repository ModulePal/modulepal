package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class SitsStatus {
    private String code;
    private String name;

    public SitsStatus(String code, String name) {
        this.code = code.toUpperCase();
        this.name = name;
    }
}
