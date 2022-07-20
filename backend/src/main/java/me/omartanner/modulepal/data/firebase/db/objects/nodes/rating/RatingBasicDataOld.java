package me.omartanner.modulepal.data.firebase.db.objects.nodes.rating;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingBasicDataOld implements Encodable, Decodable {
    private Integer c; // typeId / category
    private Boolean e; // exists
    private String t; // time
    private String u; // firebase user id
    private String v; // value | may be a float, String for comment, etc. so String is most versatile here
    private String m; // moduleCode
    private String y; // academicYear
    private Integer g; // grade

    @Override
    public void decode() {
        if (t != null) t = Base64.decode(t);
        if (u != null) u = Base64.decode(u);
        if(v != null) v = Base64.decode(v);
        if(m != null) m =  Base64.decode(m);
        if(y != null) y = Base64.decode(y);
    }

    @Override
    public void encode() {
        if (t != null) t = Base64.encode(t);
        if (u != null) u = Base64.encode(u);
        if (v != null) v = Base64.encode(v);
        if (m != null) m =  Base64.encode(m);
        if (y != null) y = Base64.encode(y);
    }
}
