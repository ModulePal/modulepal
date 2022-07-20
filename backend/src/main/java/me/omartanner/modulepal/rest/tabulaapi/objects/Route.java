package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class Route {
    private String code;
    private String name;
    private String degreeType;

    public Route(String code, String name, String degreeType) {
        this.code = code.toUpperCase();
        this.name = name;
        this.degreeType = degreeType;
    }
}
