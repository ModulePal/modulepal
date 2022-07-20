package me.omartanner.modulepal.data.firebase.db.objects.nodes.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthContext implements Encodable, Decodable {
    private String f; // firebaseUserId
    private String u; // u
    private String t; // t
    private Boolean s; // success

    @Override
    public void decode() {
        if (t != null) t = Base64.decode(t);
    }

    @Override
    public void encode() {
        if (t != null) t = Base64.encode(t);
    }
}
