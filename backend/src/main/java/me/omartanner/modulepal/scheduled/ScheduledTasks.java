package me.omartanner.modulepal.scheduled;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.HelperComponent;
import me.omartanner.modulepal.config.constants.Constants;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.h2.H2Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class ScheduledTasks {
    @Autowired
    HelperComponent helperComponent;

    @Autowired
    FirebaseDbApi firebaseDbApi;

    @Autowired
    H2Manager h2Manager;

    @Autowired
    private JavaMailSender emailSender;

    // once a week, every Monday at 1AM
    @Scheduled(cron = "0 0 1 * * MON")
    public void weeklyTask() {
        /*
            Garbage collector:
            - delete all temporary token keys
            - delete all non-existent ratings locally then in firebase
            - crawl tabula and courses API for modules and leaders, import to tabula, update local H2 cache
            - audit ratings
         */

        boolean success = true;

        // delete all temporary token secrets
        log.info("[SCHEDULED TASK] Deleting all temporary token secrets...");
        try {
            firebaseDbApi.deleteAllTemporaryTokenSecrets();
            log.info("[SCHEDULED TASK] Successfully deleted all temporary token secrets.");
        }
        catch (FirebaseDbException e) {
            log.error("[SCHEDULED TASK] Failed to delete all the temporary token secret keys!", e);
            success = false;
        }

        // delete all token secret access tokens
        log.info("[SCHEDULED TASK] Deleting all token secret access tokens...");
        try {
            firebaseDbApi.deleteAllTokenSecretAccessTokens();
            log.info("[SCHEDULED TASK] Successfully deleted token secret access tokens.");
        }
        catch (FirebaseDbException e) {
            log.error("[SCHEDULED TASK] Failed to delete all the temporary token secret keys!", e);
            success = false;
        }

        // delete all non-existant ratings
        log.info("[SCHEDULED TASK] Deleting all non-existant ratings (locally)...");
        int amountDeleted = h2Manager.deleteAllNonExistantRatings();
        log.info("[SCHEDULED TASK] Successfully deleted " + amountDeleted + " ratings (locally).");

        if (!helperComponent.updateAndLoadFirebaseDataIntoH2("[SCHEDULED TASK]", true)) {
            success = false;
        }

        // send an email saying if this succeeded or failed
        if (Constants.MAIL) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(System.getenv("MAIL_SENDER_USERNAME"));
            message.setTo("pixzlert@gmail.com");
            message.setSubject("ModulePal Weekly Task " + (success ? "Completed Successfully" : "Failed"));
            message.setText("success: " + success);
            emailSender.send(message);
        }
    }

    // hourly
    @Scheduled(cron = "0 0 * * * *")
    public void hourlyTask() {
        log.info("[SCHEDULED TASK] Updating module and department rankings...");
        h2Manager.updateAllModuleNumReviews();
        h2Manager.updateAllDepartmentNumReviews();
        log.info("[SCHEDULED TASK] Done updating module and department rankings.");
    }
}
