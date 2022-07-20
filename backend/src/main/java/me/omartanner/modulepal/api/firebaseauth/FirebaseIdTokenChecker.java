package me.omartanner.modulepal.api.firebaseauth;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserInfo;
import com.google.firebase.auth.UserRecord;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.api.responses.Response;
import me.omartanner.modulepal.api.responses.error.EmailNotVerifiedResponse;
import me.omartanner.modulepal.api.responses.error.FirebaseAuthErrorResponse;
import me.omartanner.modulepal.api.responses.error.InvalidFirebaseTokenIdResponse;
import me.omartanner.modulepal.data.firebase.auth.FirebaseAuthApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FirebaseIdTokenChecker {
    @Autowired
    private FirebaseAuthApi firebaseAuthApi;

    @Data
    @AllArgsConstructor
    public static class Result<T> {
        private Response<T> errorResponse;
        private FirebaseToken firebaseToken;

        public boolean validUser() {
            return errorResponse == null;
        }
    }

    /*
        returns an error response if the given id token is not valid or if (the email is not verified AND the user is not anonymous),
        otherwise returns null for s
     */
    public <T> Result<T> checkIdToken(String idToken) {
        FirebaseToken firebaseToken;
        try {
            firebaseToken = firebaseAuthApi.verifyIdToken(idToken);
        }
        catch (FirebaseAuthException | IllegalArgumentException e) {
            log.error("FIREBASE ID TOKEN CHECKER: FAILED TO VERIFY ID TOKEN (idToken: " + idToken + ")", e);
            return new Result<>(new FirebaseAuthErrorResponse<>(), null);
        }
        if (firebaseToken == null || firebaseToken.getUid() == null) {
            return new Result<>(new InvalidFirebaseTokenIdResponse<>(), firebaseToken);
        }
        // obtain the UserRecord from firebase to check their providers. if anonymous, don't need to do email verified check.
        UserRecord userRecord;
        try {
            userRecord = firebaseAuthApi.getUserRecord(firebaseToken.getUid());
        }
        catch (FirebaseAuthException e) {
            log.error("FIREBASE ID TOKEN CHECKER: FAILED TO OBTAIN UserRecord (idToken: " + idToken + ", uuid: " + firebaseToken.getUid() + ")", e);
            return new Result<>(new FirebaseAuthErrorResponse<>(), null);
        }
        UserInfo[] providerData = userRecord.getProviderData();
        if (providerData == null) {
            log.error("FIREBASE ID TOKEN CHECKER: null ProviderData (idToken: " + idToken + ", uuid: " + firebaseToken.getUid() + ")");
            return new Result<>(new FirebaseAuthErrorResponse<>(), null);
        }
        // if user is not anonymous (i.e. their providerData is non-empty) and their email is not verified then return email not verified response
        if (providerData.length > 0 && !firebaseToken.isEmailVerified()) {
            return new Result<>(new EmailNotVerifiedResponse<>(), firebaseToken);
        }
        return new Result<>(null, firebaseToken);
    }
}
