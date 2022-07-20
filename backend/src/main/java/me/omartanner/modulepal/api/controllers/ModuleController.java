package me.omartanner.modulepal.api.controllers;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.api.dto.*;
import me.omartanner.modulepal.api.firebaseauth.FirebaseIdTokenChecker;
import me.omartanner.modulepal.api.responses.Response;
import me.omartanner.modulepal.api.responses.body.module.*;
import me.omartanner.modulepal.api.responses.error.*;
import me.omartanner.modulepal.data.aggregates.Aggregates;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration.ModuleRegistrationBasicData;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.data.h2.model.Module;
import me.omartanner.modulepal.data.h2.model.Rating;
import me.omartanner.modulepal.data.h2.model.RatingUniUser;
import me.omartanner.modulepal.data.ratingtype.RatingType;
import me.omartanner.modulepal.helper.error.ErrorLogging;
import me.omartanner.modulepal.helper.time.TimeHelper;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path="/api/module")
@CrossOrigin(origins = {"*"}) // ADD YOUR OWN ORIGINS IF CORS REQUIRED
@Validated
@Slf4j
public class ModuleController {
    @Autowired
    private FirebaseIdTokenChecker firebaseIdTokenChecker;

    @Autowired
    private H2Manager h2Manager;

    @Autowired
    private Aggregates aggregates;

    @Autowired
    private FirebaseDbApi firebaseDbApi;

    @Autowired
    private JavaMailSender emailSender;

    @GetMapping("/getMetadata")
    public Response<ModuleMetadataResponseBody> endpointGetMetadata(
            @RequestParam(name="moduleCode") @NotNull String moduleCode,
            @RequestParam(name="includeBasicData", defaultValue = "true") @NotNull Boolean includeBasicData,
            @RequestParam(name="includeAcademicYears", defaultValue = "true") @NotNull Boolean includeAcademicYears,
            @RequestParam(name="includeLeaders", defaultValue = "true") @NotNull Boolean includeLeaders,
            @RequestParam(name="includeNumReviews", defaultValue = "true") @NotNull Boolean includeReviewsCount
            )
    {
        String context = "moduleCode: " + moduleCode;

        Optional<Module> moduleOptional = h2Manager.getModule(moduleCode);
        if (!moduleOptional.isPresent()) {
            Response<ModuleMetadataResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/module/getMetadata", context, r.getError(), null);
            return r;
        }
        Module module = moduleOptional.get();

        ModuleMetadataResponseBody response = new ModuleMetadataResponseBody();

        if (includeBasicData) response.setModuleBasicData(new ModuleBasicData(module));
        if (includeReviewsCount) response.setNumReviews(module.getNumReviewsTotal());
        if (includeLeaders) {
            List<ModuleLeader> moduleLeaders = module.getLeaders().stream().map(leader -> new ModuleLeader(leader.getAcademicYear(), leader.getUniId(), leader.getName())).collect(Collectors.toList());
            response.setLeaders(moduleLeaders);
        }
        if (includeAcademicYears) {
            Set<String> academicYears = h2Manager.getModuleAcademicYearRange(moduleCode);
            if (academicYears == null) {
                Response<ModuleMetadataResponseBody> r = new DataLookupErrorResponse<>();
                ErrorLogging.logApiError("/api/module/getMetadata", context, r.getError(), null);
                return r;
            }
            List<String> acacemicYearList = new ArrayList<>(academicYears);
            acacemicYearList.sort(new Comparator<String>() {
                @Override
                public int compare(String o1, String o2) {
                    try {
                        // extract the start year of both and compare
                        String startYear1 = o1.substring(0, 2);
                        String startYear2 = o2.substring(0, 2);
                        Integer sy1 = Integer.parseInt(startYear1);
                        Integer sy2 = Integer.parseInt(startYear2);
                        return sy1.compareTo(sy2);
                    }
                    catch (Exception e) {
                        return 0;
                    }
                }
            });
            response.setAcademicYears(acacemicYearList);
        }
        return new Response<>(true, null, response);
    }

    // search(firebaseTokenId: String, query: ModuleSearchQuery) -> PaginatedSet<ModuleApiData> (POST)
    @PostMapping("/search")
    public Response<ModuleSearchResponseBody> endpointSearch(
//            @RequestParam(n="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestBody @NotNull ModuleSearchQuery moduleSearchQuery
            )
    {
        // check id token to see if user e and has a verified e
//        FirebaseIdTokenChecker.Result<ModuleSearchResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
//        if (!checkIdTokenResult.validUser()) {
//            return checkIdTokenResult.getErrorResponse();
//        }
        String context = "moduleSearchQuery: " + moduleSearchQuery.toString();
        if (!moduleSearchQuery.valid()) {
            Response<ModuleSearchResponseBody> r = new InvalidQueryResponse<>();
            ErrorLogging.logApiError("/api/module/search", context, r.getError(), null);
            return r;
        }

        Pageable pageable = moduleSearchQuery.getPageable();

        List<Module> modules;

        boolean haveModuleName = moduleSearchQuery.getModuleName() != null;
        boolean haveDepartmentCode = moduleSearchQuery.getDepartmentCode() != null;

        if (!haveDepartmentCode) {
            modules = h2Manager.searchModulesBySubstringName(moduleSearchQuery.getModuleName(), pageable);
        }
        else {
            if (haveModuleName) {
                modules = h2Manager.searchModulesBySubstringNameAndDepartmentCode(moduleSearchQuery.getModuleName(), moduleSearchQuery.getDepartmentCode(), pageable);
            }
            else {
                modules = h2Manager.searchModulesByDepartmentCode(moduleSearchQuery.getDepartmentCode(), pageable);
            }
        }

        List<ModuleSearchData> modulesResult = new ArrayList<>();
        for (Module module : modules) {
            modulesResult.add(new ModuleSearchData(module));
        }

        ModuleSearchResponseBody moduleSearchResponseBody = new ModuleSearchResponseBody(modulesResult);

        return new Response<>(true, null, moduleSearchResponseBody);
    }

    @PostMapping("/rating/get")
    public Response<ModuleRatingGetResponseBody> endpointRatingGet(
            @RequestParam(name="firebaseTokenId", required = false) String firebaseTokenId,
            @RequestBody @NotNull ModuleRatingsQuery moduleRatingsQuery
    )
    {
        String userId = null;
        if (firebaseTokenId != null) {
            // check id token to see if user e and has a verified e
            FirebaseIdTokenChecker.Result<ModuleRatingGetResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
            if (!checkIdTokenResult.validUser()) {
                ErrorLogging.logFailedToGetEmailVerifiedUser("/api/module/rating/get", checkIdTokenResult.getErrorResponse().getError(), "moduleRatingsQuery: " + moduleRatingsQuery.toString(), firebaseTokenId);
                return checkIdTokenResult.getErrorResponse();
            }
            userId = checkIdTokenResult.getFirebaseToken().getUid();
        }
        String context = "uuid: " + userId + ", moduleRatingsQuery: " + moduleRatingsQuery.toString();
        log.info("REQUEST /api/module/rating/get (" + context + ")");

        if (!moduleRatingsQuery.valid()) {
            Response<ModuleRatingGetResponseBody> r = new InvalidQueryResponse<>();
            ErrorLogging.logApiError("/api/module/rating/get", context, r.getError(), null);
            return r;
        }

        Boolean moduleExists = h2Manager.moduleExists(moduleRatingsQuery.getModuleCode());
        if (moduleExists == null) {
            Response<ModuleRatingGetResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/module/rating/get", context, r.getError(), null);
            return r;
        }
        else if (!moduleExists) {
            Response<ModuleRatingGetResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/module/rating/get", context, r.getError(), null);
            return r;
        }

        Set<Grade> grades = moduleRatingsQuery.getGrades() == null ? Grade.all() : new HashSet<>(moduleRatingsQuery.getGrades());
        Set<RatingType> ratingTypes = moduleRatingsQuery.getRatingTypes() == null ? RatingType.all() : new HashSet<>(moduleRatingsQuery.getRatingTypes());

        List<Rating> ratings;

        String uniId = null;
        if (userId != null) {
            try {
                uniId = firebaseDbApi.getUserPrimaryUniId(userId);
            }
            catch (FirebaseDbException e) {
                Response<ModuleRatingGetResponseBody> r = new DataLookupErrorResponse<>();
                ErrorLogging.logApiError("/api/rating/get", context, r.getError(), e);
                return r;
            }
        }

        if (moduleRatingsQuery.getOnlyMyRatings() && uniId == null) {
            ratings = Collections.emptyList();
        }
        else {
            if (moduleRatingsQuery.getAcademicYears() == null) {
                ratings = h2Manager.getExistingRatingsByModuleAndGradesAndTypes(
                        moduleRatingsQuery.getModuleCode(),
                        grades,
                        ratingTypes,
                        moduleRatingsQuery.getOnlyMyRatings() ? uniId : null
                );
            }
            else {
                ratings = h2Manager.getExistingRatingsByModuleAndAcademicYearsAndGradesAndTypes(
                        moduleRatingsQuery.getModuleCode(),
                        new HashSet<>(moduleRatingsQuery.getAcademicYears()),
                        grades,
                        ratingTypes,
                        moduleRatingsQuery.getOnlyMyRatings() ? uniId : null
                );
            }
        }

        if (ratings == null) {
            Response<ModuleRatingGetResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/module/rating/get", context, r.getError(), null);
            return r;
        }

        List<RatingBasicData> ratingList = new ArrayList<>();

        for (Rating rating : ratings) {
            String academicYear = rating.getAcademicYear();
            RatingType ratingType = RatingType.fromId(rating.getTypeId());
            Grade grade = Grade.fromId(rating.getGrade());
            if (ratingType == null || grade == null) {
                Response<ModuleRatingGetResponseBody> r = new DataLookupErrorResponse<>();
                ErrorLogging.logApiError("/api/module/rating/get", context, r.getError(), null);
                return r;
            }
            // check if rating is a recursive one (e.g. LIKE) and that the parent no longer exists, in which case skip it
            if (rating.getTargetRating() != null && (rating.getTargetRating().getRatingPresent() == null || !rating.getTargetRating().getRatingPresent())) continue;

            RatingUniUser ratingUniUser = rating.getRatingUniUser();
            boolean showUserData = ratingType.isTextual() && ratingUniUser.getAnonymous() != null && !ratingUniUser.getAnonymous();
            boolean myRating = ratingUniUser != null && ratingUniUser.getUniId() != null && uniId != null && ratingUniUser.getUniId().equals(uniId); // rating is theirs if the authenticated uni id matches that of the rating
            RatingBasicData ratingBasicData = new RatingBasicData(
                    rating.getRatingId(),
                    ratingType,
                    rating.getTime(),
                    rating.getValue(),
                    academicYear,
                    grade,
                    moduleRatingsQuery.getModuleCode(),
                    showUserData ? ratingUniUser.getFirstName() : null,
                    showUserData ? ratingUniUser.getLastName() : null,
                    showUserData ? (ratingUniUser.getDepartment() == null ? null : ratingUniUser.getDepartment().getDepartmentId()) : null,
                    showUserData ? (ratingUniUser.getDepartment() == null ? null : ratingUniUser.getDepartment().getName()) : null,
                    myRating,
                    ratingType.isRecursive() ? (rating.getTargetRating() == null ? null : rating.getTargetRating().getRatingId()) : null,
                    ratingType.isTextual() ? aggregates.getTextualRatingLikes(rating.getRatingId(), true) : null,
                    ratingType.isTextual() ? aggregates.getTextualRatingLikes(rating.getRatingId(), false) : null
            );
            ratingList.add(ratingBasicData);
        }
        // done!
        ModuleRatingGetResponseBody responseBody = new ModuleRatingGetResponseBody(ratingList);
        if (moduleRatingsQuery.getOnlyMyRatings()) log.info("SUCCESS REQUEST /api/module/rating/get (" + context + ") -> ratingList: " + ratingList);
        return new Response<>(true, null, responseBody);
    }

    @PostMapping("/rating/aggregate/get")
    public Response<ModuleRatingAggregateGetResponseBody> endpointRatingAggregateGet(
//            @RequestParam(n="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name="moduleCode") @NotNull String moduleCode,
            @RequestBody(required = false) ModuleRatingAggregatesQuery moduleRatingAggregatesQuery
    )
    {
        // check id token to see if user e and has a verified e
//        FirebaseIdTokenChecker.Result<ModuleRatingAggregateGetResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
//        if (!checkIdTokenResult.validUser()) {
//            return checkIdTokenResult.getErrorResponse();
//        }
        String context = "moduleCode: " + moduleCode + ", moduleRatingAggregatesQuery: " + moduleRatingAggregatesQuery;
        if (moduleRatingAggregatesQuery != null && !moduleRatingAggregatesQuery.valid()) {
            Response<ModuleRatingAggregateGetResponseBody> r = new InvalidQueryResponse<>();
            ErrorLogging.logApiError("/api/module/rating/aggregate/get", context, r.getError(), null);
            return r;
        }

        Boolean moduleExists = h2Manager.moduleExists(moduleCode);
        if (moduleExists == null || !moduleExists) {
            Response<ModuleRatingAggregateGetResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/module/rating/aggregate/get", context, r.getError(), null);
            return r;
        }

        Map<RatingType, me.omartanner.modulepal.data.aggregates.RatingTypeAggregates> ratingTypeAggregates = null;
        if (moduleRatingAggregatesQuery != null && moduleRatingAggregatesQuery.getRatingTypes() != null) {
            Set<RatingType> ratingTypes = new HashSet<>(moduleRatingAggregatesQuery.getRatingTypes());
            ratingTypeAggregates = aggregates.getModuleAggregatesByRatingType(moduleCode, ratingTypes);
        }
        else {
            me.omartanner.modulepal.data.aggregates.ModuleAggregates moduleAggregates = aggregates.getModuleAggregates(moduleCode);
            if (moduleAggregates != null) {
                ratingTypeAggregates = moduleAggregates.getRatingTypeAggregatesConcurrentHashMap();
            }
        }
        if (ratingTypeAggregates == null) {
            Response<ModuleRatingAggregateGetResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/module/rating/aggregate/get", context, r.getError(), null);
            return r;
        }
        Map<RatingType, RatingTypeAggregates> ratingTypeAggregatesDto = new HashMap<>(ratingTypeAggregates.size());
        for (Map.Entry<RatingType, me.omartanner.modulepal.data.aggregates.RatingTypeAggregates> ratingTypeAggregatesEntry : ratingTypeAggregates.entrySet()) {
            if (ratingTypeAggregatesEntry.getValue() == null) continue;
            ratingTypeAggregatesDto.put(ratingTypeAggregatesEntry.getKey(), new RatingTypeAggregates(ratingTypeAggregatesEntry.getValue()));
        }
        ModuleAggregates moduleAggregates = new ModuleAggregates(ratingTypeAggregatesDto);
        return new Response<>(true, null, new ModuleRatingAggregateGetResponseBody(moduleAggregates));
    }

    @PostMapping("/rating/add")
    public Response<ModuleRatingAddResponseBody> endpointRatingAdd(
            @RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestBody @NotNull RatingAddBody ratingAddBody
    )
    {
        // check id token to see if user exists and has a verified email
        FirebaseIdTokenChecker.Result<ModuleRatingAddResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/module/rating/add", checkIdTokenResult.getErrorResponse().getError(), "ratingAddBody: " + ratingAddBody.toString(), firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }
        String userId = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + userId + ", ratingAddBody: " + ratingAddBody.toString();
        log.info("REQUEST /api/module/rating/add (" + context + ")");

        // validate rating add data
        if (ratingAddBody == null || !ratingAddBody.valid()) {
            Response<ModuleRatingAddResponseBody> r = new InvalidQueryResponse<>();
            ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
            return r;
        }

        String moduleCode = ratingAddBody.getModuleCode();

        Boolean moduleExists = h2Manager.moduleExists(moduleCode);
        if (moduleExists == null) {
            Response<ModuleRatingAddResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
            return r;
        }
        else if (!moduleExists) {
            Response<ModuleRatingAddResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
            return r;
        }

        String uniId = null;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(userId);
        }
        catch (FirebaseDbException e) {
            Response<ModuleRatingAddResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/rating/add", context, r.getError(), e);
            return r;
        }


        //////// REMOVE RATING IF GIVEN

        if (ratingAddBody.getRemoveRatingId() != null) {
            context += " | REMOVING RATING | ";
            RatingRemoveResult ratingRemoveResult = removeRating(ratingAddBody.getRemoveRatingId(), userId, uniId);
            Response r;
            switch (ratingRemoveResult) {
                case NOT_EXISTS:
                    r = new DataNotExistsResponse<>();
                    ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                    return r;
                case WRITE_ERROR:
                    r = new DataWriteErrorResponse<>();
                    ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                    return r;
                case INVALID_QUERY:
                    r = new InvalidQueryResponse<>(); // invalid query since rating already deleted
                    ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                    return r;
                case NOT_AUTHORISED:
                    r = new NotAuthorisedErrorResponse<>(); // not authorised response since didn't make rating
                    ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                    return r;
            }
            context += " | SUCCESSFULLY REMOVED RATING | ";
        }

        //////// END OF REMOVE RATING IF GIVEN


        // check the user has not already done any of the ratings already
        for (RatingAddData ratingAddData : ratingAddBody.getNewRatings()) {
            Boolean ratingExists =
                    ratingAddData.getType() == RatingType.LIKE ?
                            h2Manager.likeRatingExistsByUserOrUniIdAndTargetRatingIdAndRatingExists(userId, uniId, ratingAddData.getTargetRatingId())
                            :
                            h2Manager.ratingExistsByUserOrUniIdAndModuleAndTypeAndAcademicYearAndRatingExists(userId, uniId, moduleCode, ratingAddData.getType().id(), ratingAddData.getAcademicYear());
            if (ratingExists == null) {
                Response<ModuleRatingAddResponseBody> r = new DataLookupErrorResponse<>();
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                return r;
            }
            else if (ratingExists) {
                Response<ModuleRatingAddResponseBody> r = new RatingAddErrorResponse<>(RatingAddError.RATING_ALREADY_EXISTS);
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                return r;
            }
        }


        // get the module registration related to this module for the user. check that they did the module in the academic year given
        List<ModuleRegistrationBasicData> moduleRegistrationBasicDataList;
        try {
            moduleRegistrationBasicDataList = firebaseDbApi.getUserModuleRegistrationsBasicDataForModule(userId, ratingAddBody.getModuleCode());
        }
        catch (FirebaseDbException e) {
            // failed to obtain user's module r on this module from firebase
            Response<ModuleRatingAddResponseBody> r = new RatingAddErrorResponse<>(RatingAddError.FAILED_TO_OBTAIN_USER_MODULE_REGISTRATIONS);
            ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), e);
            return r;
        }
        if (moduleRegistrationBasicDataList == null || moduleRegistrationBasicDataList.isEmpty()) {
            Response<ModuleRatingAddResponseBody> r = new RatingAddErrorResponse<>(RatingAddError.NO_MODULE_REGISTRATION_EXISTS); // user did not do the module hence no data for their module r in it
            ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
            return r;
        }
        Set<String> academicYearsDoneModule = new HashSet<>();
        Map<String, Integer> academicYearMinGradeIds = new HashMap<>();
        for (ModuleRegistrationBasicData moduleRegistrationBasicData : moduleRegistrationBasicDataList) {
            academicYearsDoneModule.add(moduleRegistrationBasicData.getY());
            Integer grade = moduleRegistrationBasicData.getG();
            if (grade == null) {
                Response<ModuleRatingAddResponseBody> r = new NotAuthorisedErrorResponse<>();
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                return r;
            }
            Integer currentMinGradeId = academicYearMinGradeIds.get(moduleRegistrationBasicData.getY());
            if (currentMinGradeId == null || grade < currentMinGradeId) {
                academicYearMinGradeIds.put(moduleRegistrationBasicData.getY(), grade);
            }
        }
        boolean legalAcademicYears = ratingAddBody.verifyLegalAcademicYears(academicYearsDoneModule);
        if (!legalAcademicYears) {
            Response<ModuleRatingAddResponseBody> r = new RatingAddErrorResponse<>(RatingAddError.ILLEGAL_ACADEMIC_YEARS);
            ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
            return r;
        }

        LocalDateTime ratingTime = LocalDateTime.now();
        String ratingTimeString = TimeHelper.dateTimeToString(ratingTime);
        List<String> newRatingsIds = new ArrayList<>(ratingAddBody.getNewRatings().size());

        for (RatingAddData ratingAddData : ratingAddBody.getNewRatings()) {
            String academicYear = ratingAddData.getAcademicYear();
            Integer gradeId = academicYearMinGradeIds.get(academicYear);
            if (gradeId == null) {
                Response<ModuleRatingAddResponseBody> r = new DataLookupErrorResponse<>();
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                return r;
            }
            Grade grade = Grade.fromId(gradeId);
            me.omartanner.modulepal.data.firebase.db.objects.nodes.rating.RatingBasicData ratingBasicDataToWrite = new me.omartanner.modulepal.data.firebase.db.objects.nodes.rating.RatingBasicData(
                    ratingAddData.getType().id(),
                    true,
                    ratingTimeString,
                    userId,
                    uniId,
                    ratingAddData.getValue(),
                    moduleCode,
                    academicYear,
                    gradeId,
                    ratingAddData.getType().isRecursive() ? ratingAddData.getTargetRatingId() : null
            );
            me.omartanner.modulepal.data.firebase.db.objects.nodes.rating.RatingBasicData ratingBasicData = new me.omartanner.modulepal.data.firebase.db.objects.nodes.rating.RatingBasicData(
                    ratingAddData.getType().id(),
                    true,
                    ratingTimeString,
                    userId,
                    uniId,
                    ratingAddData.getValue(),
                    moduleCode,
                    academicYear,
                    gradeId,
                    ratingAddData.getType().isRecursive() ? ratingAddData.getTargetRatingId() : null
            );
            // write to firebase
            String ratingId;
            try {
                ratingId = firebaseDbApi.writeNewRating(ratingBasicDataToWrite);
            }
            catch (IllegalStateException | FirebaseDbException e) {
                Response<ModuleRatingAddResponseBody> r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), e);
                return r;
            }
            if (ratingId == null) {
                Response<ModuleRatingAddResponseBody> r = new RatingAddErrorResponse<>(RatingAddError.FAILED_TO_WRITE_TO_FIREBASE);
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                return r;
            }
            // write to H2 database
            Rating rating;
            try {
                rating = h2Manager.writeRating(ratingBasicData, ratingId);
            }
            catch (FirebaseDbException e) {
                Response<ModuleRatingAddResponseBody> r = new RatingAddErrorResponse<>(RatingAddError.FAILED_TO_WRITE_TO_H2);
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), e);
                return r;
            }
            if (rating == null) {
                Response<ModuleRatingAddResponseBody> r = new RatingAddErrorResponse<>(RatingAddError.FAILED_TO_WRITE_TO_H2);
                ErrorLogging.logApiError("/api/module/rating/add", context, r.getError(), null);
                return r;
            }

            // update aggregates with the new Rating in the database
            aggregates.update(rating, true);

            newRatingsIds.add(ratingId);
        }
        if (Constants.MAIL && ratingAddBody.getNewRatings() != null && ratingAddBody.getNewRatings().stream().anyMatch(r -> r.getType().isTextual())) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(System.getenv("MAIL_SENDER_USERNAME"));
            message.setTo("pixzlert@gmail.com");
            message.setSubject("[CHECK REQUIRED] New textual reviews");
            message.setText("uuid: " + userId + ", uniId: " + uniId + "\n\nratingAddBody:\n" + ratingAddBody.toString() + "\n\nnewRatingIds:\n" + newRatingsIds.toString());
            emailSender.send(message);
        }
        log.info("SUCCESS REQUEST /api/module/rating/add (" + context + ") -> newRatingIds: " + newRatingsIds.toString());
        return new Response<>(true, null, new ModuleRatingAddResponseBody(newRatingsIds));
    }

    @PostMapping("/rating/remove")
    public Response endpointRatingRemove(
            @RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name="ratingId") @NotNull String ratingId
    )
    {
        // check id token to see if user e and has a verified e
        FirebaseIdTokenChecker.Result checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
        if (!checkIdTokenResult.validUser()) {
            ErrorLogging.logFailedToGetEmailVerifiedUser("/api/module/rating/remove", checkIdTokenResult.getErrorResponse().getError(), "ratingId: " + ratingId, firebaseTokenId);
            return checkIdTokenResult.getErrorResponse();
        }

        String userId = checkIdTokenResult.getFirebaseToken().getUid();
        String context = "uuid: " + userId + ", ratingId: " + ratingId;
        log.info("REQUEST /api/module/rating/remove (" + context + ")");

        String uniId = null;
        try {
            uniId = firebaseDbApi.getUserPrimaryUniId(userId);
        }
        catch (FirebaseDbException e) {
            Response<ModuleRatingAddResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/rating/remove", context, r.getError(), e);
            return r;
        }

        RatingRemoveResult ratingRemoveResult = removeRating(ratingId, userId, uniId);
        Response r;
        switch (ratingRemoveResult) {
            case NOT_EXISTS:
                r = new DataNotExistsResponse<>();
                ErrorLogging.logApiError("/api/module/rating/remove", context, r.getError(), null);
                return r;
            case WRITE_ERROR:
                r = new DataWriteErrorResponse<>();
                ErrorLogging.logApiError("/api/module/rating/remove", context, r.getError(), null);
                return r;
            case INVALID_QUERY:
                r = new InvalidQueryResponse<>(); // invalid query since rating already deleted
                ErrorLogging.logApiError("/api/module/rating/remove", context, r.getError(), null);
                return r;
            case NOT_AUTHORISED:
                r = new NotAuthorisedErrorResponse<>(); // not authorised response since didn't make rating
                ErrorLogging.logApiError("/api/module/rating/remove", context, r.getError(), null);
                return r;
        }
        log.info("SUCCESS REQUEST /api/module/rating/remove (" + context + ")");
        return new Response<>(true, null, null);
    }

    private enum RatingRemoveResult {
        SUCCESS,
        NOT_AUTHORISED,
        INVALID_QUERY,
        NOT_EXISTS,
        WRITE_ERROR
    }


    private @NotNull RatingRemoveResult removeRating(@NotNull String ratingId, @NotNull String userId, @NotNull String uniId) {
        Optional<Rating> optionalRating = h2Manager.getRating(ratingId);
        Rating rating;
        if (optionalRating.isPresent()) {
            rating = optionalRating.get();
            String ratingUserId = rating.getRatingUserId();
            String ratingUniId = rating.getRatingUniUser() == null ? null : rating.getRatingUniUser().getUniId();
            boolean userIdMatch = userId != null && ratingUserId != null && userId.equals(ratingUserId);
            boolean uniIdMatch = uniId != null && ratingUniId != null && uniId.equals(ratingUniId);
            if (!userIdMatch && !uniIdMatch) {
                return RatingRemoveResult.NOT_AUTHORISED;
            }
            if (!rating.getRatingPresent()) {
                return RatingRemoveResult.INVALID_QUERY;
            }
        }
        else {
            return RatingRemoveResult.NOT_EXISTS;
        }

        // rating can legally be deleted, proceed...
        try {
            firebaseDbApi.writeRatingExists(ratingId, false);
        }
        catch (FirebaseDbException e) {
            return RatingRemoveResult.WRITE_ERROR;
        }
        rating.setRatingPresent(false);
        h2Manager.writeRating(rating);
        aggregates.update(rating, false);

        return RatingRemoveResult.SUCCESS;
    }

    // gets academic year range for ratings of a given module, sorted by most recent academic year first
    @GetMapping("/rating/getAcademicYearRange")
    public Response<ModuleRatingAcademicYearRangeResponseBody> endpointRatingGetAcademicYearRange(
            @RequestParam(name="moduleCode") @NotNull String moduleCode
    )
    {
        String context = "moduleCode: " + moduleCode;

        Boolean moduleExists = h2Manager.moduleExists(moduleCode);
        if (moduleExists == null) {
            Response<ModuleRatingAcademicYearRangeResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/module/rating/getAcademicYearRange", context, r.getError(), null);
            return r;
        }
        else if (!moduleExists) {
            Response<ModuleRatingAcademicYearRangeResponseBody> r = new DataNotExistsResponse<>();
            ErrorLogging.logApiError("/api/module/rating/getAcademicYearRange", context, r.getError(), null);
            return r;
        }
        Set<String> academicYears = h2Manager.getModuleAcademicYearRange(moduleCode);
        if (academicYears == null) {
            Response<ModuleRatingAcademicYearRangeResponseBody> r = new DataLookupErrorResponse<>();
            ErrorLogging.logApiError("/api/module/rating/getAcademicYearRange", context, r.getError(), null);
            return r;
        }
        List<String> acacemicYearList = new ArrayList<>(academicYears);
        acacemicYearList.sort(new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                try {
                    // extract the start year of both and compare
                    String startYear1 = o1.substring(0, 2);
                    String startYear2 = o2.substring(0, 2);
                    Integer sy1 = Integer.parseInt(startYear1);
                    Integer sy2 = Integer.parseInt(startYear2);
                    return sy1.compareTo(sy2);
                }
                catch (Exception e) {
                    return 0;
                }
            }
        });
        return new Response<>(true, null, new ModuleRatingAcademicYearRangeResponseBody(acacemicYearList));
    }
}
