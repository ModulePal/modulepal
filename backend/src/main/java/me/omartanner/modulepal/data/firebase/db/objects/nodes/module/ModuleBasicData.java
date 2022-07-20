package me.omartanner.modulepal.data.firebase.db.objects.nodes.module;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleBasicData implements Decodable, Encodable {
    private String n; // name
    private String d; // department
    private Boolean a; // active

    @Override
    public void decode() {
        if (n != null) n = Base64.decode(n);
        if (d != null) d = Base64.decode(d);
    }

    @Override
    public void encode() {
        if (n != null) n = Base64.encode(n);
        if (d != null) d = Base64.encode(d);
    }
}
