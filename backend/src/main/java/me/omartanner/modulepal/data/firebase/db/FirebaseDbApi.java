package me.omartanner.modulepal.data.firebase.db;

import com.google.firebase.database.GenericTypeIndicator;
import lombok.Getter;
import lombok.Setter;
import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.data.firebase.db.objects.DatabaseNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.auth.AuthContext;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.course.Course;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.course.CourseNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.course.Leader;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.department.DepartmentBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.department.DepartmentNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.module.ModuleBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.module.ModuleNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration.ModuleRegistrationBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.rating.RatingBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.route.RouteBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.route.RouteNode;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser.UniUserBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser.UniUserConsent;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.helper.base64.Base64;
import me.omartanner.modulepal.helper.error.ApiRequestFailedException;
import me.omartanner.modulepal.helper.json.Deserializer;
import me.omartanner.modulepal.helper.time.TimeHelper;
import me.omartanner.modulepal.rest.ApiResponse;
import me.omartanner.modulepal.rest.coursesapi.CoursesRestApi;
import me.omartanner.modulepal.rest.coursesapi.objects.ModuleFullData;
import me.omartanner.modulepal.rest.tabulaapi.TabulaRestApi;
import me.omartanner.modulepal.rest.tabulaapi.objects.Department;
import me.omartanner.modulepal.rest.tabulaapi.objects.Module;
import me.omartanner.modulepal.rest.tabulaapi.objects.Route;
import me.omartanner.modulepal.rest.tabulaapi.response.AllDepartmentsResponse;
import me.omartanner.modulepal.rest.tabulaapi.response.AllModulesResponse;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

@Component
public class FirebaseDbApi {
    @Setter
    @Getter
    private static LinkedList<String> databaseRootRef = Constants.DB_ROOT_REF;
    @Setter
    @Getter
    private static LinkedList<String> testDatabaseRootRef = Constants.TEST_DB_ROOT_REF;

    @Autowired
    private FirebaseDbManager firebaseDbManager;
    @Autowired
    private TabulaRestApi tabulaRestApi;
    @Autowired
    private H2Manager h2Manager;

    @Autowired
    private CoursesRestApi coursesRestApi;

    @Getter
    @Setter
    private boolean productionDatabase;

    public FirebaseDbApi() {
        productionDatabase = false;
    }

    // obtains the courses from the courses API and imports them into the STATIC database
    public void importStaticCoursesDatabase() throws IOException, FirebaseDbException {
       List<ModuleFullData> moduleFullDataList = coursesRestApi.getAllModulesFullData();
       if (moduleFullDataList != null) writeCourses(moduleFullDataList);
    }

    // reads courses from the courses API from the STATIC database
    public Map<String, Map<String, Course>> getCourses() throws FirebaseDbException {
        CheckedCallable<Map<String, Map<String, Course>>> c = () -> {
            CourseNode courseNode = firebaseDbManager.readAsync(staticDbPath(FirebaseDbPaths.COURSE), CourseNode.class).get();
            return courseNode == null ? null : courseNode.getCourseData();
        };
        return firebaseDbManager.runAndRethrow(c);
    }

    // writes courses from the courses API to the STATIC database
    public void writeCourses(List<ModuleFullData> courses) throws FirebaseDbException {
        CheckedCallable<Void> callable = () -> {
            CompletableFuture<Void>[] clearCompletableFutures = new CompletableFuture[courses.size()];
            CompletableFuture<Void>[] writeCompletableFutures = new CompletableFuture[courses.size()];
            int ci = 0;
            int wi = 0;
            for (ModuleFullData moduleFullData : courses) {
                String coursePath = FirebaseDbPaths.COURSE_DATA + "." + Base64.encode(moduleFullData.getStemCode()) + "." + Base64.encode(moduleFullData.getAcademicYear());
                Leader leader = moduleFullData.getLeader() == null ? null : new Leader(moduleFullData.getLeader().getUniversityId(), moduleFullData.getLeader().getName());
                Course course = new Course(moduleFullData.getCreditValue(), moduleFullData.getVisibleToStudent(), leader);
                clearCompletableFutures[ci++] = firebaseDbManager.clearAsync(staticDbPath(coursePath));
                writeCompletableFutures[wi++] = firebaseDbManager.writeEncodableAsync(staticDbPath(coursePath), course);
            }
            CompletableFuture<Void> combinedFuture = CompletableFuture.allOf(clearCompletableFutures).thenCompose($ -> CompletableFuture.allOf(writeCompletableFutures));
            return combinedFuture.get();
        };
        firebaseDbManager.runAndRethrow(callable);
    }


    public void writeRatingValue(String ratingId, String value) throws FirebaseDbException {
        firebaseDbManager.writeString(dbPath(FirebaseDbPaths.RATING_BASIC_DATA + "." + ratingId + ".v"), value, true);
    }

    public LocalDateTime getUniUserModuleRegistrationsTime(String uniId) throws FirebaseDbException {
        CheckedCallable<LocalDateTime> c = () -> {
            String time = firebaseDbManager.readAsyncString(dbPath(FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniId + ".t"), true).get();
            return time == null ? null : TimeHelper.stringToDateTime(time);
        };
        return firebaseDbManager.runAndRethrow(c);
    }

    public void writeUniUserModuleRegistrationsTime(String uniId, LocalDateTime time) throws FirebaseDbException {
        firebaseDbManager.writeString(dbPath(FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniId + ".t"), TimeHelper.dateTimeToString(time), true);
    }

    public void writeUniUserLatestFirebaseUuid(String uniId, String uuid) throws FirebaseDbException {
        firebaseDbManager.writeString(dbPath(FirebaseDbPaths.UNI_USER_AUTH_DATA + "." + uniId + ".l"), uuid, true);
    }

    public String getUniUserLatestFirebaseUuid(String uniId) throws FirebaseDbException {
        CheckedCallable<String> checkedCallable = () -> firebaseDbManager.readAsyncString(dbPath(FirebaseDbPaths.UNI_USER_AUTH_DATA + "." + uniId + ".l"), true).get();
        return firebaseDbManager.runAndRethrow(checkedCallable);
    }

    public void mapOAuthTemporaryTokenSecret(String temporaryToken, String tokenSecret) throws FirebaseDbException {
        firebaseDbManager.writeString(dbPath(FirebaseDbPaths.AUTH_TEMPORARY_TOKEN_SECRET + "." + temporaryToken), tokenSecret, false);
    }

    public void writeUniUserConsent(String uniId, UniUserConsent uniUserConsent) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_CONSENT + "." + uniId;
        firebaseDbManager.writeEncodable(dbPath(path), uniUserConsent);
    }

    public UniUserConsent getUniUserConsent(String uniId) throws FirebaseDbException {
        CheckedCallable<UniUserConsent> callable = () -> firebaseDbManager.readAsync(dbPath(FirebaseDbPaths.UNI_USER_CONSENT + "." + uniId), UniUserConsent.class).get();
        return firebaseDbManager.runAndRethrow(callable);
    }

    public UniUserBasicData getUniUserBasicData(String uniId) throws FirebaseDbException {
        CheckedCallable<UniUserBasicData> callable = () -> firebaseDbManager.readAsync(dbPath(FirebaseDbPaths.UNI_USER_BASIC_DATA + "." + uniId), UniUserBasicData.class).get();
        return firebaseDbManager.runAndRethrow(callable);
    }

    public void mapSecretAccessToken(String tokenSecret, String accessToken) throws FirebaseDbException {
        firebaseDbManager.writeString(dbPath(FirebaseDbPaths.AUTH_SECRET_ACCESS_TOKEN + "." + tokenSecret), accessToken, true);
    }

    public String getSecretAccessToken(String tokenSecret) throws FirebaseDbException {
        CheckedCallable<String> callable = () -> firebaseDbManager.readAsyncString(dbPath(FirebaseDbPaths.AUTH_SECRET_ACCESS_TOKEN + "." + tokenSecret), true).get();
        return firebaseDbManager.runAndRethrow(callable);
    }

    public String getOAuthTemporaryTokenSecret(String temporaryToken) throws FirebaseDbException {
        CheckedCallable<String> callable = () -> firebaseDbManager.readAsyncString(dbPath(FirebaseDbPaths.AUTH_TEMPORARY_TOKEN_SECRET + "." + temporaryToken), false).get();
        return firebaseDbManager.runAndRethrow(callable);
    }

    public void deleteAllTemporaryTokenSecrets() throws FirebaseDbException {
        firebaseDbManager.clear(dbPath(FirebaseDbPaths.AUTH_TEMPORARY_TOKEN_SECRET));
    }

    public void deleteAllTokenSecretAccessTokens() throws FirebaseDbException {
        firebaseDbManager.clear(dbPath(FirebaseDbPaths.AUTH_SECRET_ACCESS_TOKEN));
    }

    private LinkedList<String> staticDbPath(LinkedList<String> path) {
        LinkedList<String> fullPath = new LinkedList<>(Constants.STATIC_DB_ROOT_REF);
        fullPath.addAll(path);
        return fullPath;
    }

    private LinkedList<String> staticDbPath(String path) {
        String[] nodes = path.split("\\.");
        return staticDbPath(new LinkedList<>(Arrays.asList(nodes)));
    }

    private LinkedList<String> dbPath(LinkedList<String> path) {
        LinkedList<String> fullPath = new LinkedList<>(productionDatabase ? databaseRootRef : testDatabaseRootRef);
        fullPath.addAll(path);
        return fullPath;
    }

    private LinkedList<String> dbPath(String path) {
        String[] nodes = path.split("\\.");
        return dbPath(new LinkedList<>(Arrays.asList(nodes)));
    }

    private LinkedList<String> path(String pathString) {
        String[] nodes = pathString.split("\\.");
        return new LinkedList<>(Arrays.asList(nodes));
    }

    public void writeUniUserAnonymous(String uniId, boolean anonymous) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_BASIC_DATA + "." + uniId + ".a";
        firebaseDbManager.writeBoolean(dbPath(path), anonymous);
    }

    public Boolean getUniUserAnonymous(String uniId) throws FirebaseDbException {
        CheckedCallable<Boolean> callable = () -> firebaseDbManager.readAsyncBoolean(dbPath(FirebaseDbPaths.UNI_USER_BASIC_DATA + "." + uniId + ".a")).get();
        return firebaseDbManager.runAndRethrow(callable);
    }

    public void writeRatingExists(String ratingId, boolean exists) throws FirebaseDbException {
        String path = FirebaseDbPaths.RATING_BASIC_DATA + "." + ratingId + ".e";
        firebaseDbManager.writeBoolean(dbPath(path), exists);
    }

    public List<ModuleRegistrationBasicData> getUniUserModuleRegistrations(String uniId) throws FirebaseDbException {
        Collection<String> keys = getUniUserModuleRegistrationKeys(uniId);
        if (keys == null) return null;
        List<ModuleRegistrationBasicData> moduleRegistrationBasicDataList = new ArrayList<>(keys.size());
        for (String key : keys) {
            moduleRegistrationBasicDataList.add(getModuleRegistrationBasicData(key));
        }
        return moduleRegistrationBasicDataList;
    }

    public List<ModuleRegistrationBasicData> getUserModuleRegistrationsBasicDataForModule(String userId, String moduleCode) throws FirebaseDbException {
        String uniId = getUserPrimaryUniId(userId);
        return uniId == null ? null : getUniUserModuleRegstrationsBasicDataForModule(uniId, moduleCode);
    }

    public List<ModuleRegistrationBasicData> getUniUserModuleRegstrationsBasicDataForModule(String uniId, String moduleCode) throws FirebaseDbException {
        Collection<String> moduleRegistrationIds = getUniUserModuleRegistrationsForModule(uniId, moduleCode);
        return moduleRegistrationIds == null ? null : getModuleRegistrationsBasicData(new HashSet<>(moduleRegistrationIds));
    }

    public List<ModuleRegistrationBasicData> getModuleRegistrationsBasicData(Set<String> moduleRegistrationIds) throws FirebaseDbException {
        CheckedCallable<List<ModuleRegistrationBasicData>> callable = () -> {
            List<ModuleRegistrationBasicData> result = new ArrayList<>(moduleRegistrationIds.size());
            CompletableFuture<ModuleRegistrationBasicData>[] completableFutures = new CompletableFuture[moduleRegistrationIds.size()];
            int i = 0;
            for (String moduleRegistrationId : moduleRegistrationIds) {
                completableFutures[i++] = getModuleRegistrationBasicDataAsync(moduleRegistrationId);
            }
            CompletableFuture<Void> combinedFuture = CompletableFuture.allOf(completableFutures);
            combinedFuture.get();
            for (CompletableFuture<ModuleRegistrationBasicData> finishedFuture : completableFutures) {
                result.add(finishedFuture.get());
            }
            return result;
        };
        return firebaseDbManager.runAndRethrow(callable);
    }

    public ModuleRegistrationBasicData getModuleRegistrationBasicData(String moduleRegistrationId) throws FirebaseDbException {
        CheckedCallable<ModuleRegistrationBasicData> callable = () -> firebaseDbManager.readAsync(dbPath(FirebaseDbPaths.MODULE_REGISTRATION_BASIC_DATA + "." + moduleRegistrationId), ModuleRegistrationBasicData.class).get();
        return firebaseDbManager.runAndRethrow(callable);
    }

    public CompletableFuture<ModuleRegistrationBasicData> getModuleRegistrationBasicDataAsync(String moduleRegistrationId) throws FirebaseDbException {
        String path = FirebaseDbPaths.MODULE_REGISTRATION_BASIC_DATA + "." + moduleRegistrationId;
        return firebaseDbManager.readAsync(dbPath(path), ModuleRegistrationBasicData.class);
    }

    public String getUserPrimaryUniId(String userId) throws FirebaseDbException {
        String authContextId = getUserPrimaryAuthContextId(userId);
        return authContextId == null ? null : getAuthContextUniUser(authContextId);
    }

    // throws IllegalStateException if contained module code cannot be found in H2 database, or if such module doesn't have an associated department
    // returns the key of the new rating, and null if failed
    public String writeNewRating(RatingBasicData ratingBasicData) throws IllegalStateException, FirebaseDbException {
        // check if can obtain Module object and Deparement object from H2. if not reject request since cannot update indexes properly
        String moduleCode = ratingBasicData.getM();
        String uniId = ratingBasicData.getU();
        String userId = ratingBasicData.getF();
        me.omartanner.modulepal.data.h2.model.Department department = h2Manager.getModuleDepartment(ratingBasicData.getM());
        if (department == null) {
            throw new IllegalStateException("Couldn't find the department of the module with the module code in the given rating.");
        }
        String departmentId = department.getDepartmentId();
        // firstly write to rating.ratingBasicData
        String key = writeNewRatingBasicData(ratingBasicData);
        if (key == null) return null;
        // now do indexing
        // then, with new rating id, add to user.userRatings; module.moduleRatings, route.routeRatings; department.departmentRatings.
        if (userId != null) writeUserRatingIndex(userId, key);
        if (uniId != null) writeUniUserRatingIndex(uniId, key);
        if (moduleCode != null) writeModuleRatingIndex(moduleCode, key);
        if (departmentId != null) writeDepartmentRatingIndex(departmentId, key);
        return key;
    }

    public void writeUniUserRatingIndex(String uniId, String ratingId) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_RATINGS + "." + uniId;
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        firebaseDbManager.writeString(dbPath(path), ratingId, false);
    }

    public void writeDepartmentRatingIndex(String departmentId, String ratingId) throws FirebaseDbException {
        String path = FirebaseDbPaths.DEPARTMENT_RATINGS + "." + Base64.encode(departmentId);
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        firebaseDbManager.writeString(dbPath(path), ratingId, false);
    }

    public void writeModuleRatingIndex(String moduleId, String ratingId) throws FirebaseDbException {
        String path = FirebaseDbPaths.MODULE_RATINGS + "." + Base64.encode(moduleId);
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        firebaseDbManager.writeString(dbPath(path), ratingId, false);
    }

    public void writeUserRatingIndex(String userId, String ratingId) throws FirebaseDbException {
        String path = FirebaseDbPaths.USER_RATINGS + "." + Base64.encode(userId);
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        firebaseDbManager.writeString(dbPath(path), ratingId, false);
    }

    // returns the ID of the new rating
    public String writeNewRatingBasicData(RatingBasicData ratingBasicData) throws FirebaseDbException {
        String path = FirebaseDbPaths.RATING_BASIC_DATA;
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        firebaseDbManager.writeEncodable(dbPath(path), ratingBasicData);
        return key;
    }

    // NOTE DON'T DELETE UNI USER AUTH DATA OR RATINGS!!
    public void deleteAllUniUserNodesForUniUser(String uniId) throws FirebaseDbException {
        firebaseDbManager.clear(dbPath(FirebaseDbPaths.UNI_USER_BASIC_DATA + "." + uniId));
        //firebaseDbManager.clear(dbPath(FirebaseDbPaths.UNI_USER_AUTH_DATA + "." + uniId));
        firebaseDbManager.clear(dbPath(FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniId));
        //firebaseDbManager.clear(dbPath(FirebaseDbPaths.UNI_USER_RATINGS));
    }

    public void deleteAllUserNodesForUser(String userId) throws FirebaseDbException {
        String userIdEncrypted = Base64.encode(userId);
        firebaseDbManager.clear(dbPath(FirebaseDbPaths.USER_RATINGS + "." + userIdEncrypted));
        firebaseDbManager.clear(dbPath(FirebaseDbPaths.USER_UNI_AUTH_DATA + "." + userIdEncrypted));
    }

    public void deleteModuleRegistrationsBasicData(Iterable<String> moduleRegistrationIds) throws FirebaseDbException {
        for (String moduleRegistrationId : moduleRegistrationIds) {
            deleteModuleRegistrationBasicData(moduleRegistrationId);
        }
    }

    public void deleteModuleRegistrationBasicData(String moduleRegistrationId) throws FirebaseDbException {
        String path = FirebaseDbPaths.MODULE_REGISTRATION_BASIC_DATA + "." + moduleRegistrationId;
        firebaseDbManager.clear(dbPath(path));
    }

    public void deleteUniUserModuleRegistrations(String uniId) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniId;
        firebaseDbManager.clear(dbPath(path));
    }

    public Collection<String> getUniUserModuleRegistrationsForModule(String uniId, String moduleCode) throws FirebaseDbException {
        CheckedCallable<Collection<String>> c = () -> {
            String path = FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniId + ".m." + Base64.encode(moduleCode);
            Map<String, String> mapValues = firebaseDbManager.readAsyncStringStringMap(dbPath(path), false, false).get();
            return mapValues == null ? null : mapValues.values();
        };
        return firebaseDbManager.runAndRethrow(c);
    }

    public Collection<String> getUniUserModuleRegistrationKeys(String uniId) throws FirebaseDbException {
        CheckedCallable<Collection<String>> c = () -> {
            String path = FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniId + ".r";
            Map<String, String> mapValues = firebaseDbManager.readAsyncStringStringMap(dbPath(path), false, false).get();
            return mapValues == null ? null : mapValues.values();
        };
        return firebaseDbManager.runAndRethrow(c);
    }

    public void writeUniUserBasicData(UniUserBasicData uniUserBasicData, String uniId) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_BASIC_DATA + "." + uniId;
        firebaseDbManager.writeEncodable(dbPath(path), uniUserBasicData);
    }

    // returns 3 futures
    public CompletableFuture<Void>[] populateModuleRegistrationIndexes(String moduleRegistrationKey, String moduleCode, String uniId, String academicYear) throws FirebaseDbException {
        // populate uniUserModuleRegistrations.<u>.m
        // populate uniUserModuleRegistrations.<u>.y
        // populate uniUserModuleRegistrations.<u>.r
        return writeUniUserModuleRegistrationIndexesAsync(moduleRegistrationKey, uniId, moduleCode, academicYear);
    }

    public CompletableFuture<Void>[] writeUniUserModuleRegistrationIndexesAsync(String moduleRegistrationKey, String uniUser, String moduleCode, String academicYear) throws FirebaseDbException {
        CompletableFuture<Void>[] futures = new CompletableFuture[3];
        futures[0] = writeUniUserModuleCodeRegistrationIndexAsync(moduleRegistrationKey, uniUser, moduleCode);
        futures[1] = writeUniUserAcademicYearRegistrationIndexAsync(moduleRegistrationKey, uniUser, academicYear);
        futures[2] = writeUniUserModuleRegistrationIndexAsync(moduleRegistrationKey, uniUser);
        return futures;
    }

    public CompletableFuture<Void> writeUniUserModuleRegistrationIndexAsync(String moduleRegistrationKey, String uniUser) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniUser + ".r";
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        return firebaseDbManager.writeStringAsync(dbPath(path), moduleRegistrationKey, false);
    }

    public CompletableFuture<Void>writeUniUserAcademicYearRegistrationIndexAsync(String moduleRegistrationKey, String uniUser, String academicYear) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniUser + ".y." + Base64.encode(academicYear);
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        return firebaseDbManager.writeStringAsync(dbPath(path), moduleRegistrationKey, false);
    }

    public CompletableFuture<Void> writeUniUserModuleCodeRegistrationIndexAsync(String moduleRegistrationKey, String uniUser, String moduleCode) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_MODULE_REGISTRATIONS + "." + uniUser + ".m." + Base64.encode(moduleCode);
        String key = firebaseDbManager.generateKey(dbPath(path));
        path += "." + key;
        return firebaseDbManager.writeStringAsync(dbPath(path), moduleRegistrationKey, false);
    }

    // returns an array of the new keys
    public String[] writeNewModuleRegistrationsAndIndexes(ModuleRegistrationBasicData[] moduleRegistrationsBasicData) throws FirebaseDbException {
        CheckedCallable<String[]> callable = () -> {
            String[] keys = firebaseDbManager.generateKeys(dbPath(FirebaseDbPaths.MODULE_REGISTRATION_BASIC_DATA), moduleRegistrationsBasicData.length);
            List<CompletableFuture<Void>> futures = new ArrayList<>(4 * moduleRegistrationsBasicData.length);
            int nextFutureIndex = 0;
            for (int keyIndex = 0; keyIndex < moduleRegistrationsBasicData.length; keyIndex++) {
                String key = keys[keyIndex];
                ModuleRegistrationBasicData moduleRegistrationBasicData = moduleRegistrationsBasicData[keyIndex];
                String moduleCode = moduleRegistrationBasicData.getM();
                String uniId = moduleRegistrationBasicData.getU();
                String academicYear = moduleRegistrationBasicData.getY();
                String newModuleRegistrationPath = FirebaseDbPaths.MODULE_REGISTRATION_BASIC_DATA + "." + key;
                futures.add(firebaseDbManager.writeEncodableAsync(dbPath(newModuleRegistrationPath), moduleRegistrationBasicData));
                CompletableFuture<Void>[] indexesFutures = populateModuleRegistrationIndexes(key, moduleCode, uniId, academicYear);
                for (CompletableFuture<Void> indexesFuture : indexesFutures) {
                    futures.add(nextFutureIndex++, indexesFuture);
                }
            }

            CompletableFuture<Void> combinedFuture = CompletableFuture.allOf(futures.toArray(new CompletableFuture[futures.size()]));
            combinedFuture.get();
            return keys;
        };
        return firebaseDbManager.runAndRethrow(callable);
    }

    // creates a new module registration id <id> and writes to moduleRegistration.moduleRegistrationbasicData.<id>
    // returns <id>
    public String writeNewModuleRegistration(ModuleRegistrationBasicData moduleRegistrationBasicData) throws FirebaseDbException {
        String newModuleRegistrationKey = firebaseDbManager.generateKey(dbPath(FirebaseDbPaths.MODULE_REGISTRATION_BASIC_DATA));
        String newModuleRegistrationPath = FirebaseDbPaths.MODULE_REGISTRATION_BASIC_DATA + "." + newModuleRegistrationKey;
        firebaseDbManager.writeEncodable(dbPath(newModuleRegistrationPath), moduleRegistrationBasicData);
        return newModuleRegistrationKey;
    }

    // created new auth context in auth.context, adds to the inside uniuser's past auth contexts and inside user's past auth contexts.
    // if setPrimary is true, also sets it as the primary auth context for the inside user and uni user.
    // also updates the user and uni user's most recent auth times, where if the authcontext is successful also sets their most recent successful auth times.
    public void writeNewAuthContext(AuthContext authContext, boolean setPrimary) throws FirebaseDbException {
        String uniId = authContext.getU();
        String uuid = authContext.getF();
        // write to auth.context
        String authContextPath = FirebaseDbPaths.AUTH_CONTEXT;
        String newAuthContextKey = firebaseDbManager.generateKey(dbPath(authContextPath));
        String newAuthContextPath = authContextPath + "." + newAuthContextKey;
        String nowTime = TimeHelper.dateTimeToString(LocalDateTime.now());
        firebaseDbManager.writeEncodable(dbPath(newAuthContextPath), authContext);
        // if have uuid then write to user's auth contexts and update their auth context times
        if (uuid != null) {
            String userUniAuthDataPath = FirebaseDbPaths.USER_UNI_AUTH_DATA + "." + Base64.encode(uuid);
            String userPastAuthContextsPath = userUniAuthDataPath + ".p";
            String newUserPastAuthContextId = firebaseDbManager.generateKey(dbPath(userPastAuthContextsPath));
            String newUserPastAuthContextPath = userPastAuthContextsPath + "." + newUserPastAuthContextId;
            firebaseDbManager.writeString(dbPath(newUserPastAuthContextPath), newAuthContextKey, false);
            // update auth times for user
            String userMostRecentAuthTimePath = userUniAuthDataPath + ".t";
            firebaseDbManager.writeString(dbPath(userMostRecentAuthTimePath), nowTime, true);
            if (authContext.getS()) {
                String userMostRecentSuccessfulAuthTimePath = userUniAuthDataPath + ".s";
                firebaseDbManager.writeString(dbPath(userMostRecentSuccessfulAuthTimePath), nowTime, true);
            }
            // if setPrimary then also set the user's primary auth context
            if (setPrimary) {
                String userPrimaryAuthContextPath = userUniAuthDataPath + ".c";
                firebaseDbManager.writeString(dbPath(userPrimaryAuthContextPath), newAuthContextKey, false);
            }

        }
        // if have uni id then write to uni user's auth contexts
        if (uniId != null) {
            String uniUserUniAuthDataPath = FirebaseDbPaths.UNI_USER_AUTH_DATA + "." + uniId;
            String uniUserPastAuthContextsPath = uniUserUniAuthDataPath + ".p";
            String newUniUserPastAuthContextId = firebaseDbManager.generateKey(dbPath(uniUserPastAuthContextsPath));
            String newUniUserPastAuthContextPath = uniUserPastAuthContextsPath + "." + newUniUserPastAuthContextId;
            firebaseDbManager.writeString(dbPath(newUniUserPastAuthContextPath), newAuthContextKey, false);
            // update auth times for uni user
            String uniUserMostRecentAuthTimePath = uniUserUniAuthDataPath + ".t";
            firebaseDbManager.writeString(dbPath(uniUserMostRecentAuthTimePath), nowTime, true);
            if (authContext.getS()) {
                String uniUserMostRecentSuccessfulAuthTimePath = uniUserUniAuthDataPath + ".s";
                firebaseDbManager.writeString(dbPath(uniUserMostRecentSuccessfulAuthTimePath), nowTime, true);
            }
            // if setPrimary then also set the uni user's primary auth context
            if (setPrimary && uuid != null) {
                String uniUserPrimaryAuthContextPath = uniUserUniAuthDataPath + ".c." + Base64.encode(uuid);
                firebaseDbManager.writeString(dbPath(uniUserPrimaryAuthContextPath), newAuthContextKey, false);
            }
        }
    }

    public void deleteUserPrimaryAuthContextId(String uuid) throws FirebaseDbException {
        String path = FirebaseDbPaths.USER_UNI_AUTH_DATA + "." + Base64.encode(uuid) + ".c";
        firebaseDbManager.clear(dbPath(path));
    }

    public void deleteUniUserPrimaryAuthContextIds(String uniId) throws FirebaseDbException {
        String path = FirebaseDbPaths.UNI_USER_AUTH_DATA + "." + uniId + ".c";
        firebaseDbManager.clear(dbPath(path));
    }

    public void writeUniUserGotModuleData(String uniId, Boolean gotModuleData) throws FirebaseDbException {
        String gotModuleDataPath = FirebaseDbPaths.UNI_USER_BASIC_DATA + "." + uniId + "." + "m";
        firebaseDbManager.writeBoolean(dbPath(gotModuleDataPath), gotModuleData);
    }

    public Boolean gotUniUserModuleData(String uniId) throws FirebaseDbException {
        CheckedCallable<Boolean> c = () -> firebaseDbManager.readAsyncBoolean(dbPath(FirebaseDbPaths.UNI_USER_BASIC_DATA + "." + uniId + ".m")).get();
        return firebaseDbManager.runAndRethrow(c);
    }

    public LocalDateTime getMostRecentAuthTime(String uuid) throws FirebaseDbException {
        CheckedCallable<LocalDateTime> c = () -> {
            String mostRecentAuthTimePath = FirebaseDbPaths.USER_UNI_AUTH_DATA + "." + Base64.encode(uuid) + ".t";
            String mostRecentAuthTimeString = firebaseDbManager.readAsyncString(dbPath(mostRecentAuthTimePath), true).get();
            if (mostRecentAuthTimeString == null) return null;
            return TimeHelper.stringToDateTime(mostRecentAuthTimeString);
        };
        return firebaseDbManager.runAndRethrow(c);
    }

    public LocalDateTime getMostRecentSuccessfulAuthTime(String uuid) throws FirebaseDbException {
        CheckedCallable<LocalDateTime> c = () -> {
            String mostRecentSuccessfulAuthTimePath = FirebaseDbPaths.USER_UNI_AUTH_DATA + "." + Base64.encode(uuid) + ".s";
            String mostRecentSuccessfulAuthTimeString = firebaseDbManager.readAsyncString(dbPath(mostRecentSuccessfulAuthTimePath), true).get();
            if (mostRecentSuccessfulAuthTimeString == null) return null;
            return TimeHelper.stringToDateTime(mostRecentSuccessfulAuthTimeString);
        };
        return firebaseDbManager.runAndRethrow(c);
    }

    public String getUserPrimaryAuthContextId(String uuid) throws FirebaseDbException {
        CheckedCallable<String> c = () -> firebaseDbManager.readAsyncString(dbPath(FirebaseDbPaths.USER_UNI_AUTH_DATA + "." + Base64.encode(uuid) + ".c"), false).get();
        return firebaseDbManager.runAndRethrow(c);
    }

    public AuthContext getUserPrimaryAuthContext(String uuid) throws FirebaseDbException {
        String primaryAuthContextId = getUserPrimaryAuthContextId(uuid);
        if (primaryAuthContextId == null) return null;
        return getAuthContext(primaryAuthContextId);
    }

    public String getAuthContextUniUser(String authContextId) throws FirebaseDbException {
        CheckedCallable<String> c = () -> firebaseDbManager.readAsyncString(dbPath(FirebaseDbPaths.AUTH_CONTEXT + "." + authContextId + ".u"), false).get();
        return firebaseDbManager.runAndRethrow(c);
    }

    // Map of uuid to auth-context-id
    public Map<String, String> getUniUserPrimaryAuthContextUuidMap(String uniId) throws FirebaseDbException {
        CheckedCallable<Map<String, String>> c = () -> {
            String primaryAuthContextIdPath = FirebaseDbPaths.UNI_USER_AUTH_DATA + "." + uniId + ".c";
            return firebaseDbManager.readAsyncStringStringMap(dbPath(primaryAuthContextIdPath), true, false).get();
        };
        return firebaseDbManager.runAndRethrow(c);
    }

    public AuthContext getAuthContext(String authContextId) throws FirebaseDbException {
        CheckedCallable<AuthContext> c = () -> firebaseDbManager.readAsync(dbPath(FirebaseDbPaths.AUTH_CONTEXT + "." + authContextId), AuthContext.class).get();
        return firebaseDbManager.runAndRethrow(c);
    }

    /*
        imports the test database found in the resource databaseRaw.json into the TEST database
     */
    public void importTestDatabase() throws IOException, ParseException, FirebaseDbException {
        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource resource = resourceLoader.getResource("databaseRaw.json");
        InputStream inputStream = resource.getInputStream();
        JSONParser jsonParser = new JSONParser();
        Object jsonObject = jsonParser.parse(new InputStreamReader(inputStream));
        DatabaseNode databaseNode = Deserializer.deserialize(jsonObject, DatabaseNode.class);
        firebaseDbManager.writeEncodable(testDatabaseRootRef, databaseNode);
    }

    /*
        obtains the real static data from the tabula rest api and imports it into the STATIC database.
     */
    public void importStaticTabulaDatabase() throws IOException, ApiRequestFailedException, FirebaseDbException {
        ApiResponse<AllDepartmentsResponse> allDepartmentsResponseApiResponse = tabulaRestApi.getAllDepartments();
        if (allDepartmentsResponseApiResponse.getCode() != 200) {
            throw new ApiRequestFailedException("Tabula all departments API request had non-200 response-code. Response code: " + allDepartmentsResponseApiResponse.getCode());
        }
        Set<Department> departments = allDepartmentsResponseApiResponse.getBody().getDepartments();
        Map<String, RouteBasicData> routeBasicDataMap = new HashMap<>();
        Map<String, DepartmentBasicData> departmentBasicDataMap = new HashMap<>();
        Map<String, List<String>> departmentModules = new HashMap<>();
        Map<String, List<String>> departmentRoutes = new HashMap<>();
        for (Department department : departments) {
            String code = department.getCode().toUpperCase();
            DepartmentBasicData departmentBasicData = new DepartmentBasicData(department.getName());
            List<String> modules = new ArrayList<>();
            for (Module module : department.getModules()) {
                modules.add(module.getCode().toUpperCase());
            }
            List<String> routes = new ArrayList<>();
            for (Route route : department.getRoutes()) {
                String routeCode = route.getCode().toUpperCase();
                if (!routeBasicDataMap.containsKey(routeCode)) {
                    RouteBasicData routeBasicData = new RouteBasicData(route.getName(), route.getDegreeType());
                    routeBasicDataMap.put(routeCode, routeBasicData);
                }
                routes.add(routeCode);
            }
            departmentBasicDataMap.put(code, departmentBasicData);
            departmentModules.put(code, modules);
            departmentRoutes.put(code, routes);
        }
        RouteNode routeNode = new RouteNode(routeBasicDataMap, null);
        DepartmentNode departmentNode = new DepartmentNode(departmentBasicDataMap, null, departmentModules, departmentRoutes);

        ApiResponse<AllModulesResponse> allModulesResponseApiResponse = tabulaRestApi.getAllModules();
        if (allModulesResponseApiResponse.getCode() != 200) {
            throw new ApiRequestFailedException("Tabula all modules API request had non-200 response code. Response code: " + allModulesResponseApiResponse.getCode());
        }
        Map<String, ModuleBasicData> moduleBasicDataMap = new HashMap<>();
        Set<Module> modules = allModulesResponseApiResponse.getBody().getModules();
        for (Module module : modules) {
            moduleBasicDataMap.put(module.getCode().toUpperCase(), new ModuleBasicData(module.getName(), module.getAdminDepartment().getCode(), module.getActive()));
        }
        ModuleNode moduleNode = new ModuleNode(moduleBasicDataMap, null);
        DatabaseNode databaseNode = new DatabaseNode(null, null, moduleNode, null, routeNode, departmentNode, null, null, null);
        firebaseDbManager.clear(staticDbPath(new LinkedList<>()));
        firebaseDbManager.writeEncodable(staticDbPath(new LinkedList<>()), databaseNode);
    }

    // imports ratings from current database
    public Map<String, RatingBasicData> getRatings() throws FirebaseDbException {
        CheckedCallable<Map<String, RatingBasicData>> callable = () -> {
            GenericTypeIndicator<Map<String, RatingBasicData>> genericTypeIndicator = new GenericTypeIndicator<Map<String, RatingBasicData>>() {
            };
            Future<Map<String, RatingBasicData>> data = firebaseDbManager.readAsyncStringGenericMap(dbPath(FirebaseDbPaths.RATING_BASIC_DATA), genericTypeIndicator, false);
            return data.get();
        };
        return firebaseDbManager.runAndRethrow(callable);
    }

    // imports routes from STATIC database
    public Map<String, RouteBasicData> getRoutes() throws FirebaseDbException {
        CheckedCallable<Map<String, RouteBasicData>> callable = () -> {
            GenericTypeIndicator<Map<String, RouteBasicData>> genericTypeIndicator = new GenericTypeIndicator<Map<String, RouteBasicData>>() {
            };
            Future<Map<String, RouteBasicData>> data = firebaseDbManager.readAsyncStringGenericMap(staticDbPath(FirebaseDbPaths.ROUTE_BASIC_DATA), genericTypeIndicator, true);
            return data.get();
        };
        return firebaseDbManager.runAndRethrow(callable);
    }

    // imports departments from STATIC database
    public Map<String, DepartmentBasicData> getDepartments() throws FirebaseDbException {
        CheckedCallable<Map<String, DepartmentBasicData>> callable = () -> {
            GenericTypeIndicator<Map<String, DepartmentBasicData>> genericTypeIndicator = new GenericTypeIndicator<Map<String, DepartmentBasicData>>() {
            };
            Future<Map<String, DepartmentBasicData>> data = firebaseDbManager.readAsyncStringGenericMap(staticDbPath(FirebaseDbPaths.DEPARTMENT_BASIC_DATA), genericTypeIndicator, true);
            return data.get();
        };
        return firebaseDbManager.runAndRethrow(callable);
    }

    // imports modules from STATIC database
    public Map<String, ModuleBasicData> getModules() throws FirebaseDbException {
        CheckedCallable<Map<String, ModuleBasicData>> callable = () -> {
            GenericTypeIndicator<Map<String, ModuleBasicData>> genericTypeIndicator = new GenericTypeIndicator<Map<String, ModuleBasicData>>() {};
            Future<Map<String, ModuleBasicData>> data = firebaseDbManager.readAsyncStringGenericMap(staticDbPath(FirebaseDbPaths.MODULE_BASIC_DATA), genericTypeIndicator, true);
            return data.get();
        };
        return firebaseDbManager.runAndRethrow(callable);
    }
}
