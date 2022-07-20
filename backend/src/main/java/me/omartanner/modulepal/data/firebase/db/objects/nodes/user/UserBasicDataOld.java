package me.omartanner.modulepal.data.firebase.db.objects.nodes.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBasicDataOld implements Decodable, Encodable {
    private Boolean a; // anonymous

    @Override
    public void decode() {

    }

    @Override
    public void encode() {

    }
}
