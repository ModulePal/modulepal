package me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniUserNode implements Decodable, Encodable {
    private Map<String, UniUserBasicData> uniUserBasicData;
    private Map<String, UniUserAuthData> uniUserAuthData;
    private Map<String, UniUserModuleRegistrations> uniUserModuleRegistrations;

    @Override
    public void decode() {
        if(uniUserBasicData != null) uniUserBasicData = Base64.decodeStringMap(uniUserBasicData, false);
        if(uniUserAuthData != null) uniUserAuthData = Base64.decodeStringMap(uniUserAuthData, false);
        if(uniUserModuleRegistrations != null) uniUserModuleRegistrations = Base64.decodeStringMap(uniUserModuleRegistrations, false);
    }

    @Override
    public void encode() {
        if(uniUserBasicData != null) uniUserBasicData = Base64.encodeStringMap(uniUserBasicData, false);
        if(uniUserAuthData != null) uniUserAuthData = Base64.encodeStringMap(uniUserAuthData, false);
        if(uniUserModuleRegistrations != null) uniUserModuleRegistrations = Base64.encodeStringMap(uniUserModuleRegistrations, false);
    }
}
