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
public class UniUserModuleRegistrations implements Decodable, Encodable {
    private Map<String, List<String>> m; // moduleCodeRegistrations
    private Map<String, List<String>> y; // academicYearRegistrations
    private List<String> r; // registrations

    @Override
    public void decode() {
        if(m != null) m = Base64.decodeStringListStringMap(m, true, false);
        if(y != null) y = Base64.decodeStringListStringMap(y, true, false);
    }

    @Override
    public void encode() {
        if(m != null) m = Base64.encodeStringListStringMap(m, true, false);
        if(y != null) y = Base64.encodeStringListStringMap(y, true, false);
    }
}
