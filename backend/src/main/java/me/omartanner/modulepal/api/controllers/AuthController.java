package me.omartanner.modulepal.api.controllers;

import com.ecwid.maleorang.MailchimpClient;
import com.ecwid.maleorang.MailchimpException;
import com.ecwid.maleorang.method.v3_0.lists.members.EditMemberMethod;
import com.ecwid.maleorang.method.v3_0.lists.members.MemberInfo;
import com.google.api.client.auth.oauth.OAuthHmacSigner;
import com.google.api.client.auth.oauth.OAuthParameters;
import com.google.api.client.http.HttpResponse;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.api.auth.AuthCooldownChecker;
import me.omartanner.modulepal.api.auth.MemberDataStorer;
import me.omartanner.modulepal.api.auth.UniUserModuleRegistrationDeleter;
import me.omartanner.modulepal.api.auth.error.MemberDataStorerError;
import me.omartanner.modulepal.api.auth.error.UniUserModuleRegistrationDeleterError;
import me.omartanner.modulepal.api.dto.Consent;
import me.omartanner.modulepal.api.dto.InvalidatedRatingBasicData;
import me.omartanner.modulepal.api.dto.OAuthAuthoriseResult;
import me.omartanner.modulepal.api.dto.OAuthBeginResult;
import me.omartanner.modulepal.api.firebaseauth.FirebaseIdTokenChecker;
import me.omartanner.modulepal.api.responses.Response;
import me.omartanner.modulepal.api.responses.body.auth.OAuthAuthorisedResponseBody;
import me.omartanner.modulepal.api.responses.body.auth.OAuthBeginResponseBody;
import me.omartanner.modulepal.api.responses.body.auth.OAuthCheckResponseBody;
import me.omartanner.modulepal.api.responses.body.auth.OAuthUnlinkResponseBody;
import me.omartanner.modulepal.api.responses.error.*;
import me.omartanner.modulepal.config.OAuth1Config;
import me.omartanner.modulepal.data.firebase.auth.FirebaseAuthApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.auth.AuthContext;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser.UniUserConsent;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.data.h2.model.Rating;
import me.omartanner.modulepal.helper.error.ErrorLogging;
import me.omartanner.modulepal.helper.json.Deserializer;
import me.omartanner.modulepal.helper.time.TimeHelper;
import me.omartanner.modulepal.rest.tabulaapi.objects.Member;
import me.omartanner.modulepal.rest.tabulaapi.response.MemberResponse;
import oauth1.OAuth1WithCallback;
import oauth1.exception.GetAccessTokenException;
import oauth1.exception.GetTemporaryTokenException;
import oauth1.exception.OAuthBackedRequestException;
import oauth1.exception.TokenMapException;
import oauth1.lib.AuthorisedResult;
import oauth1.lib.BeginResult;
import oauth1.lib.RequestMethod;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@RestController
@RequestMapping(path="/api/auth")
@CrossOrigin(origins = {"*"}) // ADD YOUR OWN ORIGINS IF CORS REQUIRED
@Validated
@Slf4j
public class AuthController {
    private static final String CONSUMER_KEY = System.getenv("OAUTH_CONSUMER_KEY");
    private static final String CLIENT_SHARED_SECRET = System.getenv("OAUTH_CLIENT_SHARED_SECRET");

    @Autowired
    FirebaseDbApi firebaseDbApi;

    @Autowired
    FirebaseAuthApi firebaseAuthApi;

    @Autowired
    FirebaseIdTokenChecker firebaseIdTokenChecker;

    @Autowired
    AuthCooldownChecker authCooldownChecker;

    @Autowired
    MemberDataStorer memberDataStorer;

    @Autowired
    UniUserModuleRegistrationDeleter uniUserModuleRegistrationDeleter;

    @Autowired
    H2Manager h2Manager;

    @Autowired
    private MailchimpClient mailchimpClient;

    @GetMapping("/begin")
    public Response<OAuthBeginResponseBody> getRedirectUrl(
            @RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name="newAccount") @NotNull Boolean newAccount,
            HttpServletRequest request) {
        // check id token to see if user exists and has a verified email OR is anonymous
        FirebaseIdTokenChecker.Result<OAuthBeginResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/auth/begin",checkIdTokenResult.getErrorResponse().getError(), null, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid + ", newAccount: " + newAccount;
        log.info("REQUEST /api/auth/begin (" + context + ")");

        String uniId = null; // only non-null if not new account, to be set below

        // if updating uni data check they have an authenticated account first
        if (!newAccount) {
            AuthContext primaryAuthContext;
            try {
                primaryAuthContext = firebaseDbApi.getUserPrimaryAuthContext(uuid);
            }
            catch (FirebaseDbException e) {
                Response<OAuthBeginResponseBody> response =  new AuthErrorResponse<>(OAuthBeginResult.AUTH_CONTEXT_LOOKUP_FAILED);
                ErrorLogging.logApiError("/api/auth/begin", context, response.getError(), e);
                return response;
            }
            if (primaryAuthContext == null || !primaryAuthContext.getS() || primaryAuthContext.getU() == null) {
                Response<OAuthBeginResponseBody> response =  new AuthErrorResponse<>(OAuthBeginResult.NO_AUTHENTICATED_UNI_ACCOUNT);
                ErrorLogging.logApiError("/api/auth/begin", context, response.getError(), null);
                return response;
            }
            uniId = primaryAuthContext.getU();
        }

        // begin oauth procedure
        String origin = request.getHeader(HttpHeaders.ORIGIN);
        String callbackUrl = (origin == null ? "https://modulepal.com" : origin) + "/settings";
        OAuth1WithCallback oAuth1WithCallback = OAuth1Config.getOAuth1WithCallback(callbackUrl, firebaseDbApi);
        oAuth1WithCallback.setCallbackUrl(callbackUrl);
        BeginResult beginResult;
        try {
            beginResult = oAuth1WithCallback.begin();
        }
        catch (GetTemporaryTokenException | TokenMapException e) {
            if (e instanceof GetTemporaryTokenException) {
                Response<OAuthBeginResponseBody> r = new AuthErrorResponse<>(OAuthBeginResult.TEMPORARY_TOKEN_REQUEST_FAILED);
                ErrorLogging.logApiError("/api/auth/begin", context, r.getError(), e);
                return r;
            }
            // if a TokenMapException
            Response<OAuthBeginResponseBody> r = new DataWriteErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/begin", context, r.getError(), e);
            return r;
        }

        log.info("SUCCESS REQUEST /api/auth/begin (" + context + ") -> (authUrl: " + beginResult.getRedirectUrl() + ", tempToken: " + beginResult.getTemporaryToken());
        // Redirect to Authenticate URL in order to get Verifier Code
        return new Response<>(true, null, new OAuthBeginResponseBody(beginResult.getRedirectUrl(), beginResult.getTemporaryToken()));
    }

    @GetMapping("/check")
    public Response<OAuthCheckResponseBody> check(
            @RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name="oAuthToken") @NotNull String oAuthToken,
            @RequestParam(name="verifier") @NotNull String verifier) {
        // check id token to see if user exists and has a verified email OR is anonymous
        FirebaseIdTokenChecker.Result<OAuthCheckResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/auth/begin", checkIdTokenResult.getErrorResponse().getError(),  "oAuthToken: " + oAuthToken + ", verifier: " + verifier, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid + "oAuthToken: " + oAuthToken + ", verifier: " + verifier;
        log.info("REQUEST /api/auth/check (" + context + ")");

        // firstly we try to obtain the token secret and access token just from the temporary token. otherwise, we do the oauth procedure
        String tokenSecret = null;
        String accessToken = null;
        try {
            tokenSecret = firebaseDbApi.getOAuthTemporaryTokenSecret(oAuthToken);
        }
        catch (FirebaseDbException e) {
            Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }
        if (tokenSecret == null) {
            Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }
        try {
            accessToken = firebaseDbApi.getSecretAccessToken(tokenSecret);
        }
        catch (FirebaseDbException e) {
            Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }
        if (accessToken == null) {
            // begin oauth procedure
            AuthorisedResult authorisedResult;
            try {
                OAuth1WithCallback oAuth1WithCallback = OAuth1Config.getOAuth1WithCallback(null, firebaseDbApi);
                authorisedResult = oAuth1WithCallback.authorised(oAuthToken, verifier);
            } catch (GetAccessTokenException | TokenMapException e) {
                if (e instanceof TokenMapException) {
                    Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
                    ErrorLogging.logApiError("/api/auth/check", context, r.getError(), e);
                    return r;
                }
                // Is a GetAccessTokenException
                Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.ACCESS_TOKEN_REQUEST_FAILED);
                ErrorLogging.logApiError("/api/auth/check", context, r.getError(), e);
                return r;
            }
            accessToken = authorisedResult.getAccessToken();
        }

        // OAUTHPARAMETERS!!
        OAuthParameters oAuthParameters = buildOAuthParameters(accessToken, tokenSecret);

        // map token secret to the access token
        try {
            firebaseDbApi.mapSecretAccessToken(tokenSecret, accessToken);
        }
        catch (FirebaseDbException e) {
            Response<OAuthCheckResponseBody> r = new DataWriteErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/check", context + " Failed to map token secret to access token", r.getError(), null);
            return r;
        }

        // make attributes request to obtain university ID
        String attributes;
        try {
            HttpResponse httpResponse = OAuth1WithCallback.makeOAuthBackedRequest(
                    "https://websignon.warwick.ac.uk/oauth/authenticate/attributes",
                    oAuthParameters,
                    RequestMethod.POST,
                    null
            );
            attributes = httpResponse.parseAsString();
        } catch (OAuthBackedRequestException | IOException e) {
            Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.ATTRIBUTES_REQUEST_FAILED);
            ErrorLogging.logApiError("/api/auth/check", context, r.getError(), e);
            return r;
        }

        Pattern pattern = Pattern.compile("id=([0-9]*)");
        Matcher matcher = pattern.matcher(attributes);
        String uniId;
        if (matcher.find()) {
            uniId = matcher.group(1);
        } else {
            Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.NO_ID_MATCH_IN_ATTRIBUTES);
            ErrorLogging.logApiError("/api/auth/check", context, r.getError(), null);
            return r;
        }
        if (matcher.find()) { // shouldn't match more!! error!!
            Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.MULTIPLE_ID_MATCH_IN_ATTRIBUTES);
            ErrorLogging.logApiError("/api/auth/check", context, r.getError(), null);
            return r;
        }

        // ---- BEGIN CHECK COOLDOWN ----

        Integer authCooldownSeconds;
        try {
            authCooldownSeconds = authCooldownChecker.getCooldownSeconds(uniId);
        }
        catch (FirebaseDbException e) {
            Response<OAuthCheckResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.COOLDOWN_CALCULATION_FAILED);
            ErrorLogging.logApiError("/api/auth/check", context, r.getError(), e);
            return r;
        }
        if (authCooldownSeconds != null) { // have cooldown
            Response<OAuthCheckResponseBody> r = new Response<>(false, 22, new OAuthCheckResponseBody(authCooldownSeconds, null));
            ErrorLogging.logApiError("/api/auth/check", context, r.getError(), null);
            return r;
        }

        // ---- END CHECK COOLDOWN ----

        // now obtain and return the user's consent
        UniUserConsent uniUserConsent;
        try {
            uniUserConsent = firebaseDbApi.getUniUserConsent(uniId);
        }
        catch (FirebaseDbException e) {
            Response<OAuthCheckResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/check", context, r.getError(), e);
            return r;
        }

        Consent consent = new Consent(); // by default all null
        if (uniUserConsent != null) { // set consent fields for each that have been set
            if (uniUserConsent.getT() != null) {
                consent.setTermsResponse(uniUserConsent.getT());
            }
            if (uniUserConsent.getP() != null) {
                consent.setPrivacyResponse(uniUserConsent.getP());
            }
            if (uniUserConsent.getS() != null) {
                consent.setEmailResponse(uniUserConsent.getS());
            }
        }

        // revoke old session and log new session for uni id
        String oldLatestUuid;
        try {
            oldLatestUuid = firebaseDbApi.getUniUserLatestFirebaseUuid(uniId);
        }
        catch (FirebaseDbException e) {
            Response<OAuthCheckResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/check", context + " Failed to revoke sessions for uni user's old user ids.", r.getError(), e);
            return r;
        }
        if (oldLatestUuid != null && !uuid.equals(oldLatestUuid)) { // only revoke if the latest uuid is not the current (otherwise revoke current session! D:)
            try {
                firebaseAuthApi.revokeAllAccessTokens(oldLatestUuid);
            }
            catch (FirebaseAuthException e) {
                Response<OAuthCheckResponseBody> r = new FirebaseAuthErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/check", context + " Failed to revoke sessions for uni user's old user ids.", r.getError(), e);
                return r;
            }
        }
        try {
            firebaseDbApi.writeUniUserLatestFirebaseUuid(uniId, uuid);
        }
        catch (FirebaseDbException e) {
            Response<OAuthCheckResponseBody> r = new DataWriteErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/check", context + " Failed to revoke sessions for uni user's old user ids.", r.getError(), e);
            return r;
        }

        log.info("SUCCESS REQUEST /api/auth/check (" + context + ") -> consent: " + consent.toString());
        return new Response<>(true, null, new OAuthCheckResponseBody(null, consent));
    }


    @PostMapping("/authorised")
    public Response<OAuthAuthorisedResponseBody> authorise(
            @RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name="oAuthToken") @NotNull String oAuthToken,
            @RequestParam(name="verifier") @NotNull String verifier,
            @RequestParam(name="newAccount") @NotNull Boolean newAccount,
            @RequestParam(name="updateDataIfAlreadyExists") @NotNull Boolean updateDataIfAlreadyExists,
            @RequestBody(required = false) Consent newConsent
            ) {
        // check id token to see if user exists and has a verified email OR is anonymous
        FirebaseIdTokenChecker.Result<OAuthAuthorisedResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/auth/begin",checkIdTokenResult.getErrorResponse().getError(), "newAccount: " + newAccount + ", oAuthToken: " + oAuthToken, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid + ", newAccount: " + newAccount + ", oAuthToken: " + oAuthToken;
        log.info("REQUEST /api/auth/authorised (" + context + ")");

        String currentUniId = null; // only non-null if not new account, to be set below

        // if updating uni data check they have an authenticated account first
        if (!newAccount) {
            AuthContext primaryAuthContext;
            try {
                primaryAuthContext = firebaseDbApi.getUserPrimaryAuthContext(uuid);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.AUTH_CONTEXT_LOOKUP_FAILED);
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
            if (primaryAuthContext == null || !primaryAuthContext.getS() || primaryAuthContext.getU() == null) {
                Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.NO_AUTHENTICATED_UNI_ACCOUNT);
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
                return r;
            }
            currentUniId = primaryAuthContext.getU();
        }

        AuthContext authContext = new AuthContext(uuid, currentUniId, TimeHelper.dateTimeToString(LocalDateTime.now()), false);

        // obtain the token secret then from that obtain the access token
        String tokenSecret;
        try {
            tokenSecret = firebaseDbApi.getOAuthTemporaryTokenSecret(oAuthToken);
        }
        catch (FirebaseDbException e) {
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }
        if (tokenSecret == null) {
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }
        String accessToken;
        try {
            accessToken = firebaseDbApi.getSecretAccessToken(tokenSecret);
        }
        catch (FirebaseDbException e) {
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }
        if (accessToken == null) {
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }

        OAuthParameters oAuthParameters = buildOAuthParameters(accessToken, tokenSecret);

        // make attributes request to obtain university ID
        String attributes;
        try {
            HttpResponse httpResponse = OAuth1WithCallback.makeOAuthBackedRequest(
                    "https://websignon.warwick.ac.uk/oauth/authenticate/attributes",
                    oAuthParameters,
                    RequestMethod.POST,
                    null
            );
            attributes = httpResponse.parseAsString();
        }
        catch (OAuthBackedRequestException | IOException e) {
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e2) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e2);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.ATTRIBUTES_REQUEST_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }

        Pattern pattern = Pattern.compile("id=([0-9]*)");
        Matcher matcher = pattern.matcher(attributes);
        String uniId;
        if (matcher.find()) {
            uniId = matcher.group(1);
        }
        else {
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.NO_ID_MATCH_IN_ATTRIBUTES);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }
        if (matcher.find()) { // shouldn't match more!! error!!
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.MULTIPLE_ID_MATCH_IN_ATTRIBUTES);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }

        // if not new account (updating uni data) and uni id changed then fail
        if (!newAccount && (!uniId.equals(currentUniId))) {
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.UNI_ID_CHANGED_ON_UPDATE_DATA);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }


        // get the auth contexts of the uni id being authenticated and check there's not one that's already authenticated to the user if new account,
        // and if not new account (updating uni data) then check the there is a primary auth context of the uni user that is the uuid
        Map<String, String> primaryUniUserUuidAuthContextMap;
        try {
            primaryUniUserUuidAuthContextMap = firebaseDbApi.getUniUserPrimaryAuthContextUuidMap(uniId);
        }
        catch (FirebaseDbException e) {
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e2) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e2);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.AUTH_CONTEXT_LOOKUP_FAILED);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }

        if (newAccount && primaryUniUserUuidAuthContextMap != null && primaryUniUserUuidAuthContextMap.containsKey(uuid)) { // already authenticated, thus not new account!!
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.ILLEGAL_UNI_ID_CHANGE);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }
        if (!newAccount && (primaryUniUserUuidAuthContextMap == null || !primaryUniUserUuidAuthContextMap.containsKey(uuid))) { // updating uni user data and either uni user not authenticated to anyone or not to the current user! fail!!
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.ILLEGAL_UNI_ID_CHANGE);
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), null);
            return r;
        }

        // can set the uniId of the AuthContext now that we know it
        authContext.setU(uniId);


        // ----- BEGIN CONSENT CHECK ------

        UniUserConsent uniUserConsent;
        try {
            uniUserConsent = firebaseDbApi.getUniUserConsent(uniId);
        }
        catch (FirebaseDbException e) {
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e2) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e2);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }

        if (uniUserConsent == null) {
            uniUserConsent = new UniUserConsent(null, null, null);
        }

        boolean consentChanged = false;
        boolean mailchimpSubscriptionChanged = false;
        if (newConsent != null) { // got consent updates
            // compute new consent
            if (newConsent.getTermsResponse() != null && !newConsent.getTermsResponse().equals(uniUserConsent.getT())) {
                uniUserConsent.setT(newConsent.getTermsResponse());
                consentChanged = true;
            }
            if (newConsent.getPrivacyResponse() != null && !newConsent.getPrivacyResponse().equals(uniUserConsent.getP())) {
                uniUserConsent.setP(newConsent.getPrivacyResponse());
                consentChanged = true;
            }
            if (newConsent.getEmailResponse() != null && !newConsent.getEmailResponse().equals(uniUserConsent.getS())) {
                uniUserConsent.setS(newConsent.getEmailResponse());
                consentChanged = true;
                mailchimpSubscriptionChanged = true;
            }
        }

        if (consentChanged) {
            // write new consent
            try {
                firebaseDbApi.writeUniUserConsent(uniId, uniUserConsent);
            }
            catch (FirebaseDbException e) {
                try {
                    firebaseDbApi.writeNewAuthContext(authContext, false);
                }
                catch (FirebaseDbException e2) {
                    Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                    ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e2);
                    return r;
                }
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
        }

        if (mailchimpSubscriptionChanged) {
            // extract their email
            pattern = Pattern.compile("email=(.*?)\n");
            matcher = pattern.matcher(attributes);
            String email;
            if (matcher.find()) {
                email = matcher.group(1);
            }
            else {
                try {
                    firebaseDbApi.writeNewAuthContext(authContext, false);
                }
                catch (FirebaseDbException e) {
                    Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                    ErrorLogging.logApiError("/api/auth/authorised", context + " Failed to match email in attributes", r.getError(), e);
                    return r;
                }
                Response<OAuthAuthorisedResponseBody> r = new InternalDataFormatErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context + " Failed to match email in attributes", r.getError(), null);
                return r;
            }
            // update their mailchimp subscription
            EditMemberMethod.CreateOrUpdate createReq = new EditMemberMethod.CreateOrUpdate(Constants.MAILCHIMP_LIST_ID, email);
            String status = newConsent.getEmailResponse() ? "subscribed" : "unsubscribed";
            createReq.status_if_new = status;
            createReq.status = status;
            MemberInfo newMember;
            try {
                newMember = mailchimpClient.execute(createReq);
            }
            catch (IOException | MailchimpException e) {
                try {
                    firebaseDbApi.writeNewAuthContext(authContext, false);
                }
                catch (FirebaseDbException e2) {
                    Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                    ErrorLogging.logApiError("/api/auth/authorised", context + " Failed to create new Mailchimp member with email: " + email + ".", r.getError(), e2);
                    return r;
                }
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/user/addToMailingList", context + " Failed to create new Mailchimp member with email: " + email + ".", r.getError(), e);
                return r;
            }
        }

        // now check if they have consent
        if (uniUserConsent == null || uniUserConsent.getT() == null || uniUserConsent.getP() == null || !uniUserConsent.getT() || !uniUserConsent.getP()) {
            // failed consent if either they haven't responded to the terms and conditions and privacy policy, or haven't accepted any of the two
            try {
                firebaseDbApi.writeNewAuthContext(authContext, false);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context + " No consent.", r.getError(), e);
                return r;
            }
            Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.NO_CONSENT);
            ErrorLogging.logApiError("/api/auth/authorised", context + " No consent.", r.getError(), null);
            return r;
        }

        // ----- DONE WITH CONSENT CHECK ------


        Boolean gotUniIdDataAlready;
        LocalDateTime mostRecentModuleFetchTime;
        try {
            gotUniIdDataAlready = firebaseDbApi.gotUniUserModuleData(uniId);
            mostRecentModuleFetchTime = firebaseDbApi.getUniUserModuleRegistrationsTime(uniId);
        }
        catch (FirebaseDbException e) {
            Response<OAuthAuthorisedResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }
        if (gotUniIdDataAlready == null) gotUniIdDataAlready = false;

        boolean forceUpdateStudentData = mostRecentModuleFetchTime == null;
        if (mostRecentModuleFetchTime != null) {
            LocalDateTime now = LocalDateTime.now();
            if (mostRecentModuleFetchTime.isBefore(now.minusDays(Constants.FORCE_RERETRIEVE_WARWICK_STUDENT_DATA_NUM_DAYS))) {
                forceUpdateStudentData = true;
            }
            // if there is any force reretrieval date which is in the past but the most recent successful auth time was before that date, then we must re-retrieve
            else if (Constants.FORCE_RERETRIEVE_WARWICK_STUDENT_DATA_DATES.stream().anyMatch(d -> now.isAfter(d) && mostRecentModuleFetchTime.isBefore(d))) {
                forceUpdateStudentData = true;
            }
        }

        // only fetch Member and write to database if either we don't have the member's data already, or if we already have the member's data but we want to update the data anyway
        // or if we must re-retrieve due to the last successful auth time being too old
        if (!gotUniIdDataAlready || updateDataIfAlreadyExists || forceUpdateStudentData) {
            // make member request with the above user
            Member member;
            try {
                String memberUrl = "https://tabula.warwick.ac.uk/api/v1/member/" + uniId;
                HttpResponse httpResponse = OAuth1WithCallback.makeOAuthBackedRequest(memberUrl, oAuthParameters, RequestMethod.GET, null);
                String memberString = httpResponse.parseAsString();
                MemberResponse memberResponse = Deserializer.deserialize(memberString, MemberResponse.class);
                member = memberResponse.getMember();
            } catch (IOException | OAuthBackedRequestException e) {
                try {
                    firebaseDbApi.writeNewAuthContext(authContext, false);
                } catch (FirebaseDbException e2) {
                    Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                    ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e2);
                    return r;
                }
                Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(OAuthAuthoriseResult.MEMBER_REQUEST_FAILED);
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }

            // fetch the uni user's anonymous status
            Boolean anonymous = null;
            try {
                anonymous = firebaseDbApi.getUniUserAnonymous(uniId);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new DataLookupErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
            if (anonymous == null) anonymous = Constants.DEFAULT_ANONYMOUS_SETTING;

            /*
                FIRST DELETE THE UNI USER'S OLD MODULE REGISTRATIONS, THEN WRITE THE MEMBER TO THE DATABASE
             */
            try {
                uniUserModuleRegistrationDeleter.deleteUniUserModuleRegistrations(uniId);
                memberDataStorer.storeMemberData(member, uniId, anonymous, TimeHelper.stringToDateTime(authContext.getT()));
            } catch (MemberDataStorerError e) {
                try {
                    firebaseDbApi.writeNewAuthContext(authContext, false);
                } catch (FirebaseDbException e2) {
                    Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                    ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e2);
                    return r;
                }
                Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(e);
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            } catch (UniUserModuleRegistrationDeleterError e) {
                try {
                    firebaseDbApi.writeNewAuthContext(authContext, false);
                } catch (FirebaseDbException e2) {
                    Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
                    ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e2);
                    return r;
                }
                Response<OAuthAuthorisedResponseBody> r = new AuthErrorResponse<>(e);
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
        }

        try {
            // succesfully stored member data so set m on the uniuser to true
            firebaseDbApi.writeUniUserGotModuleData(uniId, true);

            // done
            authContext.setS(true);
            firebaseDbApi.writeNewAuthContext(authContext, true);
        }
        catch (FirebaseDbException e) {
            Response<OAuthAuthorisedResponseBody> r = new DataWriteErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
            return r;
        }

        List<Rating> changedRatings = new ArrayList<>();

        // only audit their ratings if their data was changed
        if (!gotUniIdDataAlready || updateDataIfAlreadyExists) {
            try {
                changedRatings = h2Manager.auditUserRatingsAndUpdateAggregates(uuid, uniId);
            }
            catch (FirebaseDbException e) {
                Response<OAuthAuthorisedResponseBody> r = new AuditErrorResponse<>();
                ErrorLogging.logApiError("/api/auth/authorised", context, r.getError(), e);
                return r;
            }
        }

        Set<InvalidatedRatingBasicData> invalidatedRatingBasicDataSet = new HashSet<>();
        for (Rating rating : changedRatings) {
            boolean legalBefore = rating.getLegal();
            // was invalidated if it was legal before (since changed to illegal) and vice-versa
            InvalidatedRatingBasicData invalidatedRatingBasicData = new InvalidatedRatingBasicData(rating.getModule().getModuleId(), rating.getAcademicYear(), legalBefore);
            invalidatedRatingBasicDataSet.add(invalidatedRatingBasicData);
        }

        log.info("SUCCESS REQUEST /api/auth/authorised (" + context + ") -> invalidatedRatingBasicDataSet: " + invalidatedRatingBasicDataSet.toString());
        return new Response<>(true, null, new OAuthAuthorisedResponseBody(new ArrayList<>(invalidatedRatingBasicDataSet)));
    }

    @GetMapping("/unlink")
    public Response<OAuthUnlinkResponseBody> unlink(@RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId) {
        // check id token to see if user exists and (has a verified email OR is anonymous)
        FirebaseIdTokenChecker.Result<OAuthUnlinkResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/auth/begin", checkIdTokenResult.getErrorResponse().getError(), null, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid;
        log.info("REQUEST /api/auth/unlink (" + context + ")");

        // get uni id and check it's not null in which case not yet authenticated so illegal query
        String uniId;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(uuid);
        } catch (FirebaseDbException e) {
            Response<OAuthUnlinkResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/unlink", context, r.getError(), e);
            return r;
        }

        if (uniId == null) {
            Response<OAuthUnlinkResponseBody> r = new InvalidQueryResponse<>();
            ErrorLogging.logApiError("/api/auth/unlink", context, r.getError(), null);
            return r;
        }

        // unlink their account by deleting their primary auth context id for the user and the corresponding uni user
        try {
            firebaseDbApi.deleteUserPrimaryAuthContextId(uuid);
            firebaseDbApi.deleteUniUserPrimaryAuthContextIds(uniId);
        } catch (FirebaseDbException e) {
            Response<OAuthUnlinkResponseBody> r = new DataWriteErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/unlink", context, r.getError(), e);
            return r;
        }

        // delete their uni user data
        try {
            uniUserModuleRegistrationDeleter.deleteUniUserModuleRegistrations(uniId);
        } catch (MemberDataStorerError e) {
            Response<OAuthUnlinkResponseBody> r = new AuthErrorResponse<>(e);
            ErrorLogging.logApiError("/api/auth/unlink", context, r.getError(), e);
            return new AuthErrorResponse<>(e);
        } catch (UniUserModuleRegistrationDeleterError e) {
            Response<OAuthUnlinkResponseBody> r = new AuthErrorResponse<>(e);
            ErrorLogging.logApiError("/api/auth/unlink", context, r.getError(), e);
            return new AuthErrorResponse<>(e);
        }

        // delete all uniUser nodes and update their H2 UniUserBasicData
        try {
            firebaseDbApi.deleteAllUniUserNodesForUniUser(uniId);
            h2Manager.loadRatingUniUser(uniId);
        } catch (FirebaseDbException e) {
            Response r = new DataWriteErrorResponse();
            ErrorLogging.logApiError("/api/auth/unlink", context, r.getError(), e);
            return r;
        }

        // audit their ratings
        List<Rating> changedRatings;
        try {
            changedRatings = h2Manager.auditUserRatingsAndUpdateAggregates(uuid, uniId);
        } catch (FirebaseDbException e) {
            Response<OAuthUnlinkResponseBody> r = new AuditErrorResponse<>();
            ErrorLogging.logApiError("/api/auth/unlink", context, r.getError(), e);
            return r;
        }

        Set<InvalidatedRatingBasicData> invalidatedRatingBasicDataSet = new HashSet<>();
        for (Rating rating : changedRatings) {
            boolean legalBefore = rating.getLegal();
            // was invalidated if it was legal before (since changed to illegal) and vice-versa
            InvalidatedRatingBasicData invalidatedRatingBasicData = new InvalidatedRatingBasicData(rating.getModule().getModuleId(), rating.getAcademicYear(), legalBefore);
            invalidatedRatingBasicDataSet.add(invalidatedRatingBasicData);
        }
        log.info("SUCCESS REQUEST /api/auth/unlink (" + context + ") -> invalidatedRatingBasicDataSet: " + invalidatedRatingBasicDataSet.toString());
        return new Response<>(true, null, new OAuthUnlinkResponseBody(new ArrayList<>(invalidatedRatingBasicDataSet)));
    }


    @Nonnull
    private OAuthParameters buildOAuthParameters(@Nonnull String accessToken, @Nonnull String tokenSecret) {
        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = CLIENT_SHARED_SECRET;
        signer.tokenSharedSecret = tokenSecret;
        OAuthParameters oauthParameters = new OAuthParameters();
        signer.tokenSharedSecret = tokenSecret;
        oauthParameters.signer = signer;
        oauthParameters.consumerKey = CONSUMER_KEY;
        oauthParameters.token = accessToken;
        oauthParameters.signatureMethod = "HMAC-SHA1";
        oauthParameters.version = "1.0";
        return oauthParameters;
    }
}
