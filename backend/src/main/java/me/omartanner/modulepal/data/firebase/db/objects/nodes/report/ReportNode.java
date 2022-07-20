package me.omartanner.modulepal.data.firebase.db.objects.nodes.report;

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
public class ReportNode implements Encodable, Decodable {
    private Map<String, ReportBasicData> reportBasicData;

    @Override
    public void decode() {
        if (reportBasicData != null) reportBasicData = Base64.decodeStringMap(reportBasicData, false);
    }

    @Override
    public void encode() {
        if (reportBasicData != null) reportBasicData = Base64.encodeStringMap(reportBasicData, false);
    }
}
