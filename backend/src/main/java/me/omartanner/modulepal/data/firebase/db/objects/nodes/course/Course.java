package me.omartanner.modulepal.data.firebase.db.objects.nodes.course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Course implements Decodable, Encodable {
    private Float c; // number of cats
    private Boolean v; // visible
    private Leader l; // leader


    @Override
    public void decode() {
        if (l != null) l.decode();
    }

    @Override
    public void encode() {
        if (l != null) l.encode();
    }
}
