package me.omartanner.modulepal.data.firebase.db.objects.nodes.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportBasicData implements Decodable, Encodable {
    private String u; // userId
    private String r; // ratingId
    private String m; // reason / message
    private String t; // time

    @Override
    public void decode() {
        if (u != null) u = Base64.decode(u);
        if (m != null) m = Base64.decode(m);
        if (t != null) t = Base64.decode(t);
    }

    @Override
    public void encode() {
        if (u != null) u = Base64.encode(u);
        if (m != null) m = Base64.encode(m);
        if (t != null) t = Base64.encode(t);
    }
}
