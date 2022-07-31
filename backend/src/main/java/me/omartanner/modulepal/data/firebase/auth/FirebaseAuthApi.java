package me.omartanner.modulepal.data.firebase.auth;

import com.google.firebase.auth.*;
import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FirebaseAuthApi {
    @Autowired
    private FirebaseAuth firebaseAuth;

    @Autowired FirebaseDbApi firebaseDbApi;

    public String getUuid(String firebaseIdToken) throws FirebaseAuthException, IllegalArgumentException {
        return firebaseAuth.verifyIdToken(firebaseIdToken).getUid();
    }

    public FirebaseToken verifyIdToken(String firebaseIdToken) throws FirebaseAuthException, IllegalArgumentException {
        return firebaseAuth.verifyIdToken(firebaseIdToken);
    }

    public UserRecord getUserRecord(String userId) throws FirebaseAuthException {
        return firebaseAuth.getUser(userId);
    }

    public UserRecord executeUpdateRequest(UserRecord.UpdateRequest updateRequest) throws FirebaseAuthException {
       return firebaseAuth.updateUser(updateRequest);
    }

    public void deleteUser(String userId) throws FirebaseAuthException {
        firebaseAuth.deleteUser(userId);
    }

    public void revokeAllAccessTokens(String uuid) throws FirebaseAuthException {
        try {
            firebaseAuth.revokeRefreshTokens(uuid);
        }
        catch (FirebaseAuthException e) {
            if (!e.getErrorCode().equals("user-not-found")) { // skip not exists (e.g. access token from old firebase deployment)
                throw e;
            }
        }
    }

    public String revokeAllAccessTokensAndObtainNew(String uuid) throws FirebaseAuthException {
        revokeAllAccessTokens(uuid);
        return firebaseAuth.createCustomToken(uuid);
    }

    public void revokeAllAccessTokens() throws FirebaseAuthException {
        // Iterate through all users. This will still retrieve users in batches,
        // buffering no more than 1000 users in memory at a time.
        ListUsersPage page = firebaseAuth.listUsers(null);
        for (ExportedUserRecord user : page.iterateAll()) {
            String uuid = user.getUid();
            if (uuid == null) continue;
            revokeAllAccessTokens(uuid);
            log.info("[FirebaseAuthApi.revokeAllAccessTokens] Successfully revoked " + uuid + " access tokens.");
        }
    }
}
