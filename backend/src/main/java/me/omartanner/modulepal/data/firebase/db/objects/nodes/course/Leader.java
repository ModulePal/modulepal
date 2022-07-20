package me.omartanner.modulepal.data.firebase.db.objects.nodes.course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Leader implements Decodable, Encodable {
    private String u; // uni id
    private String n; // name

    @Override
    public void decode() {
        if (n != null) n = Base64.decode(n);
    }

    @Override
    public void encode() {
        if (n != null) n = Base64.encode(n);
    }
}
