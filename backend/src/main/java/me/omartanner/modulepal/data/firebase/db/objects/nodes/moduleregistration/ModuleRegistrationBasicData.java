package me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.helper.base64.Base64;
import me.omartanner.modulepal.rest.tabulaapi.objects.ModuleRegistration;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleRegistrationBasicData implements Encodable, Decodable {
    private String u; // uniId
    private String m; // m
    private String y; // y
    private String p; // mark/percentage
    private Integer g; // g

    public ModuleRegistrationBasicData(ModuleRegistration moduleRegistration, String u) {
        this.u = u;
        this.m = moduleRegistration.getModule().getCode().toUpperCase();
        this.y = moduleRegistration.getAcademicYear();
        this.p = moduleRegistration.getMark() == null ? null : moduleRegistration.getMark().toString();
        if (this.p == null) {
            this.g = Grade.U.id();
        }
        else {
            Grade grade = Grade.fromMark(Float.valueOf(this.p));
            this.g = grade == null ? null : grade.id();
        }
    }

    @Override
    public void decode() {
        if (m != null) m = Base64.decode(m);
        if (y != null) y = Base64.decode(y);
        if (p != null) p = Base64.decode(p);
    }

    @Override
    public void encode() {
        if (m != null) m = Base64.encode(m);
        if (y != null) y = Base64.encode(y);
        if (p != null) p = Base64.encode(p);
    }
}
