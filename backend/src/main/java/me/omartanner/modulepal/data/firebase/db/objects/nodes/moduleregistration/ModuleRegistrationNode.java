package me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration;

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
public class ModuleRegistrationNode implements Decodable, Encodable {
    private Map<String, ModuleRegistrationBasicData> moduleRegistrationBasicData;

    @Override
    public void decode() {
        if (moduleRegistrationBasicData != null) moduleRegistrationBasicData = Base64.decodeStringMap(moduleRegistrationBasicData, false);
    }

    @Override
    public void encode() {
        if(moduleRegistrationBasicData != null) moduleRegistrationBasicData = Base64.encodeStringMap(moduleRegistrationBasicData, false);
    }
}
