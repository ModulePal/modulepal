package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

@Data
public class RelationshipType {
    private String agentRole;
    private String studentRole;
    private String id;
    private String description;
    private String urlPart;

    public RelationshipType(String agentRole, String studentRole, String id, String description, String urlPart) {
        this.agentRole = agentRole;
        this.studentRole = studentRole;
        this.id = id.toUpperCase();
        this.description = description;
        this.urlPart = urlPart;
    }
}
