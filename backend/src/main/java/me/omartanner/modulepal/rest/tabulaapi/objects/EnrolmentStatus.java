package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class EnrolmentStatus {
    private String code;
    private String name;

    public EnrolmentStatus(String code, String name) {
        this.code = code.toUpperCase();
        this.name = name;
    }
}
