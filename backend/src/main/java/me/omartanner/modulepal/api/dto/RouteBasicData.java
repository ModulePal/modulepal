package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.data.h2.model.Route;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RouteBasicData {
    private String routeId;
    private String name;
    private String degreeType;

    public RouteBasicData(Route route) {
        this.routeId = route.getRouteId();
        this.name = route.getName();
        this.degreeType = route.getDegreeType();
    }
}
