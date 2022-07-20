package me.omartanner.modulepal.data.firebase.db.objects.nodes.module;

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
public class ModuleNode implements Decodable, Encodable {
    private Map<String, ModuleBasicData> moduleBasicData;
    private Map<String, List<String>> moduleRatings;

    @Override
    public void decode() {
        if (moduleBasicData != null) moduleBasicData = Base64.decodeStringMap(moduleBasicData, true);
        if (moduleRatings != null) moduleRatings = Base64.decodeStringListStringMap(moduleRatings, true, false);
    }

    @Override
    public void encode() {
        if (moduleBasicData != null) moduleBasicData = Base64.encodeStringMap(moduleBasicData, true);
        if (moduleRatings != null) moduleRatings = Base64.encodeStringListStringMap(moduleRatings, true, false);
    }
}
