package me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniUserBasicData implements Decodable, Encodable {
    private String f; // firstName
    private String l; // lastName
    private String e; // email
    private String d; // departmentId
//    private String r; // routeId
    private Boolean m; // gotModuleData
    private Boolean a; // anonymous

    @Override
    public void decode() {
        if (f != null) f = Base64.decode(f);
        if (l != null) l = Base64.decode(l);
        if(e != null) e = Base64.decode(e);
        if(d != null) d = Base64.decode(d);
//        if(r != null) r = Base64.decode(r);
    }

    @Override
    public void encode() {
        if(f != null) f = Base64.encode(f);
        if(l != null) l = Base64.encode(l);
        if(e != null) e = Base64.encode(e);
        if(d != null) d = Base64.encode(d);
//        if(r != null) r = Base64.encode(r);
    }
}
