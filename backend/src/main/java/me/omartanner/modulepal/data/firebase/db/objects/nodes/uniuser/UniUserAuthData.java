package me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniUserAuthData implements Decodable, Encodable {
    private String t; // t
    private String s; // s
    private Map<String, String> c; // c
    private List<String> p; // p
    private String l;

    @Override
    public void decode() {
        if (t != null) t = Base64.decode(t);
        if (s != null) s = Base64.decode(s);
        if (l != null) l = Base64.decode(l);
        if (c != null) c = Base64.decodeStringStringMap(c, true, false);
    }

    @Override
    public void encode() {
        if (t != null) t = Base64.encode(t);
        if (s != null) s = Base64.encode(s);
        if (l != null) l = Base64.encode(l);
        if (c != null) c = Base64.encodeStringStringMap(c, true, false);
    }
}
