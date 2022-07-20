package me.omartanner.modulepal.data.firebase.db.objects.nodes.department;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentNode implements Decodable, Encodable {
    private Map<String, DepartmentBasicData> departmentBasicData;
    private Map<String, List<String>> departmentRatings;
    private Map<String, List<String>> departmentModules;
    private Map<String, List<String>> departmentRoutes;

    @Override
    public void decode() {
        if (departmentBasicData != null) departmentBasicData = Base64.decodeStringMap(departmentBasicData, true);
        if (departmentRatings != null) departmentRatings = Base64.decodeStringListStringMap(departmentRatings, true, false);
        if (departmentModules != null) departmentModules = Base64.decodeStringListStringMap(departmentModules, true, true);
        if (departmentRoutes != null) departmentRoutes = Base64.decodeStringListStringMap(departmentRoutes, true, true);
    }

    @Override
    public void encode() {
        if (departmentBasicData != null) departmentBasicData = Base64.encodeStringMap(departmentBasicData, true);
        if (departmentRatings != null) departmentRatings = Base64.encodeStringListStringMap(departmentRatings, true, false);
        if (departmentModules != null) departmentModules = Base64.encodeStringListStringMap(departmentModules, true, true);
        if (departmentRoutes != null) departmentRoutes = Base64.encodeStringListStringMap(departmentRoutes, true, true);
    }
}
