package me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniUserConsent implements Decodable, Encodable {
    private Boolean t; // agreed to terms and conditions
    private Boolean p; // agreed to privacy policy
    private Boolean s; // subscribed to mailchimp

    @Override
    public void decode() {

    }

    @Override
    public void encode() {

    }
}
