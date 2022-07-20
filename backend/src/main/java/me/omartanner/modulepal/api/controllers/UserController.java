package me.omartanner.modulepal.api.controllers;


import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.api.auth.UniUserModuleRegistrationDeleter;
import me.omartanner.modulepal.api.auth.error.UniUserModuleRegistrationDeleterError;
import me.omartanner.modulepal.api.dto.DepartmentBasicData;
import me.omartanner.modulepal.api.dto.InvalidatedRatingBasicData;
import me.omartanner.modulepal.api.dto.ModuleRegistration;
import me.omartanner.modulepal.api.firebaseauth.FirebaseIdTokenChecker;
import me.omartanner.modulepal.api.responses.Response;
import me.omartanner.modulepal.api.responses.body.user.GetPrimaryUniUserBasicDataResponseBody;
import me.omartanner.modulepal.api.responses.body.user.GetPrimaryUniUserModuleRegistrationsResponseBody;
import me.omartanner.modulepal.api.responses.body.user.UserGetAnonymousResponseBody;
import me.omartanner.modulepal.api.responses.body.user.UserGetInvalidatedRatingsResponseBody;
import me.omartanner.modulepal.api.responses.error.*;
import me.omartanner.modulepal.data.aggregates.Aggregates;
import me.omartanner.modulepal.data.firebase.auth.FirebaseAuthApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration.ModuleRegistrationBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser.UniUserBasicData;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.data.h2.model.Department;
import me.omartanner.modulepal.data.h2.model.Rating;
import me.omartanner.modulepal.helper.error.ErrorLogging;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(path="/api/user")
@CrossOrigin(origins = {"*"}) // ADD YOUR OWN ORIGINS IF CORS REQUIRED
@Validated
@Slf4j
public class UserController {
    @Autowired
    FirebaseDbApi firebaseDbApi;

    @Autowired
    private FirebaseIdTokenChecker firebaseIdTokenChecker;

    @Autowired
    private H2Manager h2Manager;

    @Autowired
    private Aggregates aggregates;

    @Autowired
    private FirebaseAuthApi firebaseAuthApi;

    @Autowired
    private UniUserModuleRegistrationDeleter uniUserModuleRegistrationDeleter;

    @GetMapping("/uniUser/getPrimaryUniUserBasicData")
    public Response<GetPrimaryUniUserBasicDataResponseBody> endpointGetPrimaryUniUserBasicData(@RequestParam(name = "firebaseTokenId") @NotNull String firebaseTokenId) {
        // check id token to see if user e and has a verified e
        FirebaseIdTokenChecker.Result<GetPrimaryUniUserBasicDataResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/user/uniUser/getPrimaryUniUserBasicData", checkIdTokenResult.getErrorResponse().getError(), null, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid;
        log.info("REQUEST /api/user/uniUser/getPrimaryUniUserBasicData (" + context + ")");

        String uniId;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(uuid);
        } catch (FirebaseDbException e) {
            Response<GetPrimaryUniUserBasicDataResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserBasicData", context, r.getError(), e);
            return r;
        }
        if (uniId == null) {
            Response<GetPrimaryUniUserBasicDataResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserBasicData", context, r.getError(), null);
            return r;
        }

        UniUserBasicData uniUserBasicData;
        try {
            uniUserBasicData = firebaseDbApi.getUniUserBasicData(uniId);
        } catch (FirebaseDbException e) {
            Response<GetPrimaryUniUserBasicDataResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserBasicData", context, r.getError(), e);
            return r;
        }

        if (uniUserBasicData == null) {
            Response<GetPrimaryUniUserBasicDataResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserBasicData", context, r.getError(), null);
            return r;
        }

        Optional<Department> optionalDepartment = uniUserBasicData.getD() != null ? h2Manager.getDepartment(uniUserBasicData.getD()) : Optional.empty();

//        Optional<Route> optionalRoute = h2Manager.getRoute(uniUserBasicData.getR());
//        if (!optionalRoute.isPresent()) {
//            return new DataLookupErrorResponse<>();
//        }
//        Route route = optionalRoute.get();

        me.omartanner.modulepal.api.dto.UniUserBasicData apiUniUserBasicData = new me.omartanner.modulepal.api.dto.UniUserBasicData(
                uniId,
                uniUserBasicData.getF(),
                uniUserBasicData.getL(),
                uniUserBasicData.getE(),
                optionalDepartment.isPresent() ? new DepartmentBasicData(optionalDepartment.get()) : null,
                uniUserBasicData.getM(),
                uniUserBasicData.getA()
        );

        log.info("SUCCESS REQUEST /api/user/uniUser/getPrimaryUniUserBasicData (" + context + ") -> uniUserBasicData: " + apiUniUserBasicData.toString());
        return new Response<>(true, null, new GetPrimaryUniUserBasicDataResponseBody(apiUniUserBasicData));
    }

    @GetMapping("/uniUser/getPrimaryUniUserModuleRegistrations")
    public Response<GetPrimaryUniUserModuleRegistrationsResponseBody> endpointGetPrimaryUniUserModuleRegistrations(
            @RequestParam(name = "firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name = "moduleCode", required = false) String moduleCode
    )
    {
        // check id token to see if user e and has a verified e
        FirebaseIdTokenChecker.Result<GetPrimaryUniUserModuleRegistrationsResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", checkIdTokenResult.getErrorResponse().getError(), "moduleCode: " + moduleCode, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid + ", moduleCode: " + moduleCode;
        log.info("REQUEST /api/user/uniUser/getPrimaryUniUserModuleRegistrations (" + context + ")");

        String uniId;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(uuid);
        } catch (FirebaseDbException e) {
            Response<GetPrimaryUniUserModuleRegistrationsResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", context, r.getError(), e);
            return r;
        }
        if (uniId == null) {
            Response<GetPrimaryUniUserModuleRegistrationsResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", context, r.getError(), null);
            return r;
        }

        List<ModuleRegistrationBasicData> moduleRegistrationBasicDataList;
        try {
            if (moduleCode == null || moduleCode.length() == 0) {
                moduleRegistrationBasicDataList = firebaseDbApi.getUniUserModuleRegistrations(uniId);
            }
            else {
                Boolean moduleExists = h2Manager.moduleExists(moduleCode);
                if (moduleExists == null) {
                    Response<GetPrimaryUniUserModuleRegistrationsResponseBody> r = new DataLookupErrorResponse<>();
                    ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", context, r.getError(), null);
                    return r;
                }
                else if (!moduleExists) {
                    Response<GetPrimaryUniUserModuleRegistrationsResponseBody> r = new InvalidQueryResponse<>();
                    ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", context, r.getError(), null);
                    return r;
                }
                moduleRegistrationBasicDataList = firebaseDbApi.getUniUserModuleRegstrationsBasicDataForModule(uniId, moduleCode);
            }
        }
        catch (FirebaseDbException e) {
            Response<GetPrimaryUniUserModuleRegistrationsResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", context, r.getError(), e);
            return r;
        }

        if (moduleRegistrationBasicDataList == null) {
            Response<GetPrimaryUniUserModuleRegistrationsResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", context, r.getError(), null);
            return r;
        }

        List<ModuleRegistration> moduleRegistrations = new ArrayList<>(moduleRegistrationBasicDataList.size());
        for (ModuleRegistrationBasicData moduleRegistrationBasicData : moduleRegistrationBasicDataList) {
            try {
                String moduleName = h2Manager.getModuleName(moduleRegistrationBasicData.getM());
                //Float mark = moduleRegistrationBasicData.getP() == null ? null : Float.parseFloat(moduleRegistrationBasicData.getP());
                //Grade grade = moduleRegistrationBasicData.getG() == null ? Grade.U : Grade.fromId(moduleRegistrationBasicData.getG());
                Integer numRatings = h2Manager.getUniUserNumReviewsOnModule(uniId, moduleRegistrationBasicData.getM());
                ModuleRegistration moduleRegistration = new ModuleRegistration(
                        moduleRegistrationBasicData.getU(),
                        moduleRegistrationBasicData.getM(),
                        moduleName,
                        moduleRegistrationBasicData.getY(),
                        //mark,
                        //grade,
                        numRatings
                );
                moduleRegistrations.add(moduleRegistration);
            }
            catch (NumberFormatException e) {
                Response<GetPrimaryUniUserModuleRegistrationsResponseBody> r = new InternalDataFormatErrorResponse<>();
                ErrorLogging.logApiError("/api/user/uniUser/getPrimaryUniUserModuleRegistrations", context, r.getError(), e);
                return r;
            }
        }
        log.info("SUCCESS REQUEST /api/user/uniUser/getPrimaryUniUserModuleRegistrations (" + context + ") -> moduleRegistrations: " + moduleRegistrations.toString());
        return new Response<>(true, null, new GetPrimaryUniUserModuleRegistrationsResponseBody(moduleRegistrations));
    }

    /*
    DEPRECIATED - use getPrimaryUniUserBasicData
    @GetMapping("/anonymous/get")
    public Response<UserGetAnonymousResponseBody> endpointGetAnonymous(
            @RequestParam(name = "firebaseTokenId") @NotNull String firebaseTokenId
    )
    {
        // check id token to see if user exists
        FirebaseIdTokenChecker.Result<UserGetAnonymousResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        FirebaseToken token = checkIdTokenResult.getFirebaseToken();
        if (token == null || token.getUid() == null) {
            Response response = new InvalidFirebaseTokenIdResponse();
            ErrorLogging.logFailedToGetUser("/api/user/anonymous/get", response.getError(), null, firebaseTokenId);
            return response;
        }
        String userId = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + userId;
        log.info("REQUEST /api/user/anonymous/get (uuid: " + userId + ")");

        Boolean anonymous;
        try {
            anonymous = firebaseDbApi.getUserAnonymous(userId);
        }
        catch (FirebaseDbException e) {
            Response<UserGetAnonymousResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/anonymous/get", context, r.getError(), e);
            return r;
        }

        if (anonymous == null) {
            anonymous = Constants.DEFAULT_ANONYMOUS_SETTING;
        }

        log.info("SUCCESS REQUEST /api/user/anonymous/get (" + context + ") -> anonymous: " + anonymous);
        return new Response<>(true, null, new UserGetAnonymousResponseBody(anonymous));
    }*/

    @PostMapping("/uniUser/anonymous/set")
    public Response endpointSetAnonymous(
            @RequestParam(name = "firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name = "anonymous") @NotNull Boolean anonymous
    )
    {
        // check id token to see if user e and has a verified e
        FirebaseIdTokenChecker.Result<UserGetAnonymousResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        FirebaseToken token = checkIdTokenResult.getFirebaseToken();
        if (token == null || token.getUid() == null) {
            Response response = new InvalidFirebaseTokenIdResponse();
            ErrorLogging.logFailedToGetUser("/api/uniUser/anonymous/set", response.getError(), "anonymous: " + anonymous, firebaseTokenId);
            return response;
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid + ", anonymous: " + anonymous;
        log.info("REQUEST /api/uniUser/anonymous/set (" + context + ")");

        String uniId;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(uuid);
        } catch (FirebaseDbException e) {
            Response r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/uniUser/anonymous/set", context, r.getError(), e);
            return r;
        }
        
        Boolean currentAnonymous;
        try {
            currentAnonymous = firebaseDbApi.getUniUserAnonymous(uniId);
        }
        catch (FirebaseDbException e) {
            Response r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/uniUser/anonymous/set", context, r.getError(), e);
            return r;
        }

        if (currentAnonymous == null) {
            currentAnonymous = Constants.DEFAULT_ANONYMOUS_SETTING;
        }

        if (currentAnonymous == anonymous) {
            Response r = new InvalidQueryResponse<>(); // not changing their a status so invalid query
            ErrorLogging.logApiError("/api/uniUser/anonymous/set", context, r.getError(), null);
            return r;
        }

        // update firebase
        try {
            firebaseDbApi.writeUniUserAnonymous(uniId, anonymous);
        }
        catch (FirebaseDbException e) {
            Response r = new DataWriteErrorResponse<>();
            ErrorLogging.logApiError("/api/uniUser/anonymous/set", context, r.getError(), e);
            return r;
        }

        // update h2 data and RatingContexts
        h2Manager.updateUniUserAnonymous(uniId, anonymous);

        // success
        log.info("SUCCESS REQUEST /api/uniUser/anonymous/set (" + context + ")");
        return new Response<>(true, null, null);
    }

    @GetMapping("/getInvalidatedRatings")
    public Response<UserGetInvalidatedRatingsResponseBody> endpointGetInvalidatedRatings(
            @RequestParam(name = "firebaseTokenId") @NotNull String firebaseTokenId
    )
    {
        // check id token to see if user exists and has a verified email
        FirebaseIdTokenChecker.Result<UserGetInvalidatedRatingsResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/user/getInvalidatedRatings", checkIdTokenResult.getErrorResponse().getError(), null, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String uuid = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + uuid;
        log.info("REQUEST /api/user/getInvalidatedRatings (" + context + ")");

        String uniId;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(uuid);
        } catch (FirebaseDbException e) {
            Response<UserGetInvalidatedRatingsResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/getInvalidatedRatings", context, r.getError(), e);
            return r;
        }

        List<Rating> illegalRatings = h2Manager.getIllegalExistingRatings(uuid, uniId);

        if (illegalRatings == null) {
            Response<UserGetInvalidatedRatingsResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/getInvalidatedRatings", context, r.getError(), null);
            return r;
        }

        Set<InvalidatedRatingBasicData> invalidatedRatingBasicDataSet = new HashSet<>();
        for (Rating rating : illegalRatings) {
            InvalidatedRatingBasicData invalidatedRatingBasicData = new InvalidatedRatingBasicData(rating.getModule().getModuleId(), rating.getAcademicYear(), true);
            invalidatedRatingBasicDataSet.add(invalidatedRatingBasicData);
        }

        log.info("SUCCESS REQUEST /api/user/getInvalidatedRatings (" + context + ") -> invalidatedRatingBasicDataSet: " + invalidatedRatingBasicDataSet);
        return new Response<>(true, null, new UserGetInvalidatedRatingsResponseBody(new ArrayList<>(invalidatedRatingBasicDataSet)));
    }

    @PostMapping("/removeAllRatings")
    public Response endpointRemoveAllRatings(
            @RequestParam(name = "firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name = "onlyInvalidated") @NotNull Boolean onlyInvalidated
    )
    {
        // check id token to see if user exists and has a verified email
        FirebaseIdTokenChecker.Result<UserGetInvalidatedRatingsResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/user/removeAllRatings", checkIdTokenResult.getErrorResponse().getError(), "onlyInvalidated: " + onlyInvalidated, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String userId = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + userId + ", onlyInvalidated: " + onlyInvalidated;
        log.info("REQUEST /api/user/removeAllRatings (" + context + ")");

        String uniId;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(userId);
        } catch (FirebaseDbException e) {
            Response r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/removeAllRatings", context, r.getError(), e);
            return r;
        }
        List<Rating> userRatings = onlyInvalidated ? h2Manager.getIllegalExistingRatings(userId, uniId) : h2Manager.getUserOrUniUserExistingRatings(userId, uniId);

        if (userRatings == null) {
            Response r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/removeAllRatings", context, r.getError(), null);
            return r;
        }

        for (Rating rating : userRatings) {
            try {
                firebaseDbApi.writeRatingExists(rating.getRatingId(), false);
            }
            catch (FirebaseDbException e) {
                Response r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/user/removeAllRatings", context, r.getError(), e);
                return r;
            }
            // only update the  aggregates if the rating is legal since illegal ratings don't contribute anyway
            if (rating.getLegal()) {
                aggregates.update(rating, false);
            }
        }

        h2Manager.deleteAllUserOrUniUserRatings(userId, uniId);

        log.info("SUCCESS REQUEST /api/user/removeAllRatings (" + context + ")");
        return new Response<>(true, null, null);
    }

    @PostMapping("/delete")
    public Response endpointDelete(
            @RequestParam(name = "firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name = "deleteAllReviews") @NotNull Boolean deleteAllReviews
    )
    {
        // check id token to see if user exists
        FirebaseIdTokenChecker.Result checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        FirebaseToken token = checkIdTokenResult.getFirebaseToken();
        if (token == null || token.getUid() == null) {
            Response response = new InvalidFirebaseTokenIdResponse();
            ErrorLogging.logFailedToGetUser("/api/user/delete", response.getError(), null, firebaseTokenId);
            return response;
        }
        String userId = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + userId;
        log.info("REQUEST /api/user/delete (" + context + ")");

        String uniId;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(userId);
        }
        catch (FirebaseDbException e) {
            Response r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/user/delete", context, r.getError(), e);
            return r;
        }

        if (uniId != null) {
            try {
                uniUserModuleRegistrationDeleter.deleteUniUserModuleRegistrations(uniId);
            }
            catch (UniUserModuleRegistrationDeleterError e) {
                Response r = new AuthErrorResponse<>(e);
                ErrorLogging.logApiError("/api/user/delete", context, r.getError(), e);
                return r;
            }

            // delete uniUser nodes in firebase, and update UniUserBasicData in H2 (will just fill the uniId field)
            try {
                firebaseDbApi.deleteAllUniUserNodesForUniUser(uniId);
                h2Manager.loadRatingUniUser(uniId);
            }
            catch (FirebaseDbException e) {
                Response r = new DataWriteErrorResponse();
                ErrorLogging.logApiError("/api/user/delete", context, r.getError(), e);
                return r;
            }
        }

        /* DON'T DELETE user.uniAuthData or user.userRatings!!
        try {
            firebaseDbApi.deleteAllUserNodesForUser(userId);
        }
        catch (FirebaseDbException e) {
            Response r = new DataWriteErrorResponse();
            ErrorLogging.logApiError("/api/user/delete", context, r.getError(), e);
            return r;
        }*/

        // delete all their ratings if deleteAllReviews = true
        if (deleteAllReviews) {
            // get all of the user's and uni user's EXISTING ratings and set not exists on each in firebase
            List<Rating> ratings = h2Manager.getUserOrUniUserExistingRatings(userId, uniId);
            for (Rating rating : ratings) {
                try {
                    firebaseDbApi.writeRatingExists(rating.getRatingId(), false);
                }
                catch (FirebaseDbException e) {
                    Response r = new DataWriteErrorResponse();
                    ErrorLogging.logApiError("/api/user/delete", context, r.getError(), e);
                    return r;
                }
            }
            // set all of the user's ratings not exist locally in h2
            h2Manager.deleteAllUserOrUniUserRatings(userId, uniId);
        }

        // audit their ratings
        try {
            h2Manager.auditUserRatingsAndUpdateAggregates(userId, uniId);
        }
        catch (FirebaseDbException e) {
            Response r = new AuditErrorResponse();
            ErrorLogging.logApiError("/api/user/delete", context, r.getError(), e);
            return r;
        }

        // now revoke all access tokens (but don't delete firebase account)
        try {
            firebaseAuthApi.revokeAllAccessTokens(userId);
        }
        catch (FirebaseAuthException e) {
            Response r = new FirebaseAuthErrorResponse();
            ErrorLogging.logApiError("/api/user/delete", context + " Failed to revoke all user's access tokens.", r.getError(), e);
            return r;
        }

        log.info("SUCCESS REQUEST /api/user/delete (" + context + ")");
        return new Response<>(true, null, null);

    }
}
