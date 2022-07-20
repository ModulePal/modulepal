package me.omartanner.modulepal.data.firebase.db.objects.nodes.route;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteNode implements Decodable, Encodable {
    private Map<String, RouteBasicData> routeBasicData;
    private Map<String, List<String>> routeRatings;

    @Override
    public void decode() {
        if (routeBasicData != null) routeBasicData = Base64.decodeStringMap(routeBasicData, true);
        if (routeRatings != null) routeRatings = Base64.decodeStringListStringMap(routeRatings, true, false);
    }

    @Override
    public void encode() {
        if (routeBasicData != null) routeBasicData = Base64.encodeStringMap(routeBasicData, true);
        if (routeRatings != null) routeRatings = Base64.encodeStringListStringMap(routeRatings, true, false);
    }
}
