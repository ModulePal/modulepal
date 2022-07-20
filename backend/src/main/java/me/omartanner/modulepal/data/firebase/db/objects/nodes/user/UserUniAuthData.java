package me.omartanner.modulepal.data.firebase.db.objects.nodes.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUniAuthData implements Decodable, Encodable {
    private String t; // mostRecentAuthTime
    private String s; // mostRecentSuccessfulAuthTime
    private String c; // primaryAuthContextId
    private List<String> p; // pastAuthContextIds

    @Override
    public void decode() {
        if (t != null) t = Base64.decode(t);
        if (s != null) s = Base64.decode(s);
    }

    @Override
    public void encode() {
        if(t != null) t = Base64.encode(t);
        if (s != null) s = Base64.encode(s);
    }
}
