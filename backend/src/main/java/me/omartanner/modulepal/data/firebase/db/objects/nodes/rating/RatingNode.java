package me.omartanner.modulepal.data.firebase.db.objects.nodes.rating;

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
public class RatingNode implements Encodable, Decodable {
    private Map<String, RatingBasicData> ratingBasicData;
    private Map<String, List<String>> ratingReports;

    @Override
    public void decode() {
        if (ratingBasicData != null) ratingBasicData = Base64.decodeStringMap(ratingBasicData, false);
    }

    @Override
    public void encode() {
        if (ratingBasicData != null) ratingBasicData = Base64.encodeStringMap(ratingBasicData, false);
    }
}
