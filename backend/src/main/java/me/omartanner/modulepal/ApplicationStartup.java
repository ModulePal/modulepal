package me.omartanner.modulepal;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.h2.H2Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.TimeZone;

@Component
@Slf4j
public class ApplicationStartup implements ApplicationListener<ApplicationReadyEvent> {
    @Autowired
    private H2Manager h2Manager;

    @Autowired
    private FirebaseDbApi firebaseDbApi;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private HelperComponent helperComponent;


    /**
     * This event is executed as late as conceivably possible to indicate that
     * the application is ready to service requests.
     */
    @Override
    public void onApplicationEvent(final ApplicationReadyEvent event) {
        TimeZone.setDefault(TimeZone.getTimeZone("Europe/London"));
        log.info("SET TIMEZONE\n");

        log.info("\n----- CONFIGURING DATABASE SETTINGS -----\n");
        firebaseDbApi.setProductionDatabase(Constants.STARTUP_PRODUCTION_DB);
        log.info("--- SET PRODUCTION DATABASE SETTING TO: " + Constants.STARTUP_PRODUCTION_DB + ".");
        log.info("\n----- DONE CONFIGURING DATABASE SETTINGS -----\n");

        if (Constants.STARTUP_LOAD_DB) {
            log.info("\n----- LOADING FIREBASE DATA -----\n");
            String updateModulesAndLeadersOnStartup = System.getenv("MP_UPDATE_MODULES_AND_LEADERS_ON_STARTUP");
            boolean updateModulesAndLeaders = updateModulesAndLeadersOnStartup != null && updateModulesAndLeadersOnStartup.toUpperCase().equals("TRUE");
            log.info("UPDATE MODULES AND LEADERS: " + updateModulesAndLeaders);
            if (!helperComponent.updateAndLoadFirebaseDataIntoH2("[STARTUP]", updateModulesAndLeaders)) {
                log.error("STARTUP LOAD FIREBASE DATA FAILED");
            }
            log.info("\n----- DONE LOADING FIREBASE DATA -----\n");

            // delete all non-existant ratings
            log.info("\n----- DELETING ALL NON-EXISTANT RATINGS (LOCALLY) -----\n");
            int amountDeleted = h2Manager.deleteAllNonExistantRatings();
            log.info("\n----- DONE DELETING ALL NON-EXISTANT RATINGS (LOCALLY) (COUNT: " + amountDeleted + ") -----\n");
        }
        else {
            log.info("\n----- NOT LOADING DATABASE ON STARTUP -----\n");
        }

        // delete all temporary token secrets
        log.info("\n----- DELETING ALL TEMPORARY TOKEN SECRETS (FIREBASE) -----\n");
        try {
            firebaseDbApi.deleteAllTemporaryTokenSecrets();
            log.info("\n----- SUCCESSFULLY DELETED ALL TEMPORARY TOKEN SECRETS (FIREBASE) -----\n");
        }
        catch (FirebaseDbException e) {
            log.error("STARTUP DELETE ALL TEMPORARY TOKEN SECRETS FAILED!", e);
        }

        // delete all token secret access tokens
        log.info("\n----- DELETING ALL TOKEN SECRET ACCESS TOKENS (FIREBASE) -----\n");
        try {
            firebaseDbApi.deleteAllTokenSecretAccessTokens();
            log.info("\n----- SUCCESSFULLY DELETED ALL TEMPORARY TOKEN SECRETS (FIREBASE) -----\n");
        }
        catch (FirebaseDbException e) {
            log.error("STARTUP DELETE ALL TEMPORARY TOKEN SECRETS FAILED!", e);
        }

        // send email
        if (Constants.MAIL) {
            log.info("\n----- SENDING EMAIL -----\n");

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(System.getenv("MAIL_SENDER_USERNAME"));
            message.setTo("pixzlert@gmail.com");
            message.setSubject("ModulePal Backend Restarted");
            message.setText("System restarted.");
            emailSender.send(message);

            log.info("\n----- SUCCESSFULLY SENT EMAIL -----\n");
        }
        else {
            log.info("\n----- NOT SENDING EMAIL -----\n");
        }

        log.info("\n----- UPDATING MODULE & DEPARTMENT RANKS -----\n");
        h2Manager.updateAllModuleNumReviews();
        h2Manager.updateAllDepartmentNumReviews();
        log.info("\n----- SUCCESSFULLY UPDATED MODULE & DEPARTMENT RANKS -----\n");

        log.info("\n---------- STARTUP SUCCESS ----------\n");
    }
}
