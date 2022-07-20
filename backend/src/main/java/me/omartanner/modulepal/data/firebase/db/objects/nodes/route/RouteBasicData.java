package me.omartanner.modulepal.data.firebase.db.objects.nodes.route;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteBasicData implements Decodable, Encodable {
    private String name;
    private String degreeType;

    @Override
    public void decode() {
        if (name != null) name = Base64.decode(name);
        if (degreeType != null) degreeType = Base64.decode(degreeType);
    }

    @Override
    public void encode() {
        if (name != null) name = Base64.encode(name);
        if (degreeType != null) degreeType = Base64.encode(degreeType);
    }
}
