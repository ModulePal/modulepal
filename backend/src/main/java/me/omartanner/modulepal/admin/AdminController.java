package me.omartanner.modulepal.admin;

import com.google.firebase.auth.FirebaseAuthException;
import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.HelperComponent;
import me.omartanner.modulepal.data.firebase.auth.FirebaseAuthApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.helper.error.ApiRequestFailedException;
import me.omartanner.modulepal.helper.error.ErrorLogging;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@Slf4j
public class AdminController {
    @Autowired
    private FirebaseDbApi firebaseDbApi;

    @Autowired
    private FirebaseAuthApi firebaseAuthApi;

    @Autowired
    private H2Manager h2Manager;


    @Autowired
    private HelperComponent helperComponent;


    @PostMapping("/admin/database/importTestData")
    public boolean importTestData() {
        try {
            firebaseDbApi.importTestDatabase();
            h2Manager.loadFirebaseModules();
        }
        catch (IOException | ParseException | FirebaseDbException e) {
            ErrorLogging.logApiError("/api/admin/database/importTestData", "", null, e);
            return false;
        }
        return true;
    }

    @PostMapping("/admin/database/importRealData")
    public boolean importRealData() {
        // import order: routes, departments, modules
        try {
            firebaseDbApi.importStaticTabulaDatabase();

        }
        catch (IOException | ApiRequestFailedException | FirebaseDbException e) {
            return false;
        }
        return true;
    }


    @PostMapping("/admin/database/setTestDatabase")
    public boolean setTestDatabase() {
        firebaseDbApi.setProductionDatabase(false);
        return true;
    }

    @PostMapping("/admin/database/setProductionDatabase")
    public boolean setProductionDatabase() {
        firebaseDbApi.setProductionDatabase(true);
        return true;
    }

    @PostMapping("/admin/database/h2/load")
    public boolean loadH2Database() {
        return helperComponent.updateAndLoadFirebaseDataIntoH2("[ADMIN CONTROLLER]", true);
    }

    @PostMapping("/admin/auth/revokeAllAccessTokens")
    public boolean revokeAllAccessTokens() {
        try {
            firebaseAuthApi.revokeAllAccessTokens();
        }
        catch (FirebaseAuthException e) {
            ErrorLogging.logApiError("/admin/auth/revokeAllAccessTokens", "", null, e);
            return false;
        }
        return true;
    }
}
