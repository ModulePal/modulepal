package me.omartanner.modulepal.data.firebase.db.objects.nodes.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthNode implements Decodable, Encodable {
    private Map<String, String> temporaryTokenSecret;
    private Map<String, AuthContext> context;

    @Override
    public void decode() {
        if (context != null) context = Base64.decodeStringMap(context, false);
    }

    @Override
    public void encode() {
        if (context != null) context = Base64.encodeStringMap(context, false);
    }
}
