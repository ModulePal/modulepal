package me.omartanner.modulepal.data.firebase.db.objects.nodes.user;

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
public class UserNode implements Encodable, Decodable {
    private Map<String, List<String>> userRatings;
    private Map<String, List<String>> userReports;
    private Map<String, UserUniAuthData> userUniAuthData;

    @Override
    public void decode() {
        if(userRatings != null) userRatings = Base64.decodeStringListStringMap(userRatings, true, false);
        if(userReports != null) userReports = Base64.decodeStringListStringMap(userReports, true, false);
        if(userUniAuthData != null) userUniAuthData = Base64.decodeStringMap(userUniAuthData, true);
    }

    @Override
    public void encode() {
        if(userRatings != null) userRatings = Base64.encodeStringListStringMap(userRatings, true, false);
        if(userReports != null) userReports = Base64.encodeStringListStringMap(userReports, true, false);
        if(userUniAuthData != null) userUniAuthData = Base64.encodeStringMap(userUniAuthData, true);
    }
}
