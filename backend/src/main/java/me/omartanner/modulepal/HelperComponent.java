package me.omartanner.modulepal;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.data.aggregates.Aggregates;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.h2.H2Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class HelperComponent {
    @Autowired
    private FirebaseDbApi firebaseDbApi;

    @Autowired
    private H2Manager h2Manager;

    @Autowired
    private Aggregates aggregates;

    /*
        updates the firebase static data from the Tabula and Courses API, then loads the static data (routes, departments, modules, leaders and ratings) into the H2 database from the current database of the firebase api
        finally, cleans up the the local data and fills the aggregates
     */
    public boolean updateAndLoadFirebaseDataIntoH2(String logPrefix, Boolean updateModulesAndLeaders) {
        // note this order of deletion is important - don' want to break keys
        logPrefix += " [UPDATE AND LOAD FIREBASE DATA INTO H2]";
        log.info(logPrefix + " Deleting H2 data...");
        h2Manager.deleteAllRatings();
        h2Manager.deleteAllRatingUniUsers();
        h2Manager.deleteAllModuleLeaders();
        h2Manager.deleteAllModules();
        h2Manager.deleteAllDepartments();
        log.info(logPrefix + " Successfully deleted H2 data, loading Firebase departments....");
        try {
            h2Manager.loadFirebaseDepartments();
        }
        catch (FirebaseDbException e) {
            log.error(logPrefix + " Failed to load Firebase departments.", e);
            return false;
        }
        log.info(logPrefix + " Successfully loaded Firebase departments, syncing modules and leaders from Tabula&Courses -> Firebase -> H2...");
        try {
            syncModulesAndLeaders(updateModulesAndLeaders);
        }
        catch (IOException e) {
            log.error(logPrefix + " Failed to sync modules and leaders from Tabula&Courses -> Firebase -> H2", e);
            return false;
        }
        log.info(logPrefix + " Successfully synced modules and leaders from Tabula&Courses -> Firebase -> H2, loading Firebase ratings...");
        try {
            h2Manager.loadFirebaseRatings();
        }
        catch (FirebaseDbException e) {
            log.error(logPrefix + " Failed to load Firebase ratings.", e);
            return false;
        }
        log.info(logPrefix + " - LOADED RATINGS & RATING CONTEXTS");
        h2Manager.cleanupData();
        log.info(logPrefix + " - CLEANED UP DATA");
        log.info(logPrefix + " ----- SUCCESSFULLY LOADED FIREBASE DATA INTO H2 DATABASE -----\n\n");
        log.info(logPrefix + " ----- AUDITING ALL RATINGS -----\n");
        h2Manager.auditAllUserRatings(); // PERFORM AUDIT
        log.info(logPrefix + " \n----- SUCCESSFULLY AUDITED ALL RATINGS -----\n\n");
        log.info(logPrefix + " LOADING AGGREGRATES...\n");
        aggregates.fill();
        log.info(logPrefix + " \n----- SUCCESSFULLY LOADED AGGREGATES -----\n\n");
        return true;
    }

    // fetches the modules and leaders from Tabula and Courses respectively, imports them to firebase, then updates local H2 cache with the updated firebase data
    private void syncModulesAndLeaders(Boolean updateModulesAndLeaders) throws IOException {
        if (updateModulesAndLeaders) {
            try {
                firebaseDbApi.importStaticTabulaDatabase();
            }
            catch (FirebaseDbException | IOException e) {
                throw new IOException("Failed to import modules from Tabula!", e);
            }
        }
        try {
            h2Manager.loadFirebaseModules();
        }
        catch (FirebaseDbException e) {
            throw new IOException("Failed to import the modules from Firebase into the H2 cache!", e);
        }


        if (updateModulesAndLeaders) {
            try {
                firebaseDbApi.importStaticCoursesDatabase();
            }
            catch (FirebaseDbException | IOException e) {
                throw new IOException("Failed to import leaders from Courses!", e);
            }
        }
        try {
            h2Manager.loadFirebaseLeaders();
        }
        catch (FirebaseDbException e) {
            throw new IOException("Failed to import the Course leaders from Firebase into the H2 cache!", e);
        }
    }
}
