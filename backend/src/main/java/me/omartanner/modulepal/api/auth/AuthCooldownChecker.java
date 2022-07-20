package me.omartanner.modulepal.api.auth;

import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.auth.AuthContext;
import me.omartanner.modulepal.helper.time.TimeHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
public class AuthCooldownChecker {
    @Autowired
    FirebaseDbApi firebaseDbApi;

    // precondition: latest firebase uni id for uni id is previous (hasn't been updated to current uuid yet)
    public Integer getCooldownSeconds(String uniId) throws FirebaseDbException {
        Boolean gotUniUserModuleData = firebaseDbApi.gotUniUserModuleData(uniId);
        if (gotUniUserModuleData == null || !gotUniUserModuleData) return null;
        String prevUuid = firebaseDbApi.getUniUserLatestFirebaseUuid(uniId);
        if (prevUuid == null) return null;
        AuthContext prevAuthContext = firebaseDbApi.getUserPrimaryAuthContext(prevUuid);
        if (prevAuthContext == null) return null;

        LocalDateTime prevSuccessfulAuthTime = TimeHelper.stringToDateTime(prevAuthContext.getT());
        LocalDateTime now = LocalDateTime.now();

        // prevSuccessfulAuthTime must be below (now - COOLDOWN_SECS) to not have a cooldown
        if (now.minusSeconds(Constants.AUTH_COOLDOWN_SECONDS).isBefore(prevSuccessfulAuthTime)) { // have a cooldown
            return Constants.AUTH_COOLDOWN_SECONDS - ((int) prevSuccessfulAuthTime.until(now, ChronoUnit.SECONDS));
        }

        return null;
    }
}
