package me.omartanner.modulepal.data.firebase.db.objects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.auth.AuthNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.department.DepartmentNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.module.ModuleNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration.ModuleRegistrationNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.rating.RatingNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.report.ReportNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.route.RouteNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser.UniUserNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.user.UserNode;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DatabaseNode implements Encodable, Decodable {
    private UserNode user;
    private UniUserNode uniUser;
    private ModuleNode module;
    private ModuleRegistrationNode moduleRegistration;
    private RouteNode route;
    private DepartmentNode department;
    private RatingNode rating;
    private ReportNode report;
    private AuthNode auth;

    @Override
    public void decode() {
        if(user != null) user.decode();
        if(uniUser != null) uniUser.decode();
        if(module != null) module.decode();
        if(moduleRegistration != null) moduleRegistration.decode();
        if(route != null) route.decode();
        if(department != null) department.decode();
        if(rating != null) rating.decode();
        if(report != null) report.decode();
        if(auth != null) auth.decode();
    }

    @Override
    public void encode() {
        if(user != null) user.encode();
        if(uniUser != null) uniUser.encode();
        if(module != null) module.encode();
        if(moduleRegistration != null) moduleRegistration.encode();
        if(route != null) route.encode();
        if(department != null) department.encode();
        if(rating != null) rating.encode();
        if(report != null) report.encode();
        if(auth != null) auth.encode();
    }
}
