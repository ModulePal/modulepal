package me.omartanner.modulepal.data.h2;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.data.aggregates.Aggregates;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.course.Course;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.course.Leader;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.department.DepartmentBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.module.ModuleBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration.ModuleRegistrationBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.rating.RatingBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser.UniUserBasicData;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.data.h2.model.Module;
import me.omartanner.modulepal.data.h2.model.*;
import me.omartanner.modulepal.data.h2.repository.*;
import me.omartanner.modulepal.data.h2.repository.projection.AcademicYearProjection;
import me.omartanner.modulepal.data.ratingtype.LikeRatingConstants;
import me.omartanner.modulepal.data.ratingtype.RatingType;
import me.omartanner.modulepal.helper.time.TimeHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import java.util.*;
import java.util.function.Consumer;

@Component
@Slf4j
public class H2Manager {
    @Autowired
    private FirebaseDbApi firebaseDbApi;
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private ModuleRepository moduleRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private RatingUniUserRepository ratingUniUserRepository;
    @Autowired
    private ModuleLeaderRepository moduleLeaderRepository;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private Aggregates aggregates;

    public int getUniUserNumReviewsOnModule(String uniId, String moduleCode) {
        return ratingRepository.getNumRatingsFromUniUserOnModule(uniId, moduleCode);
    }

    public String getModuleName(String moduleCode) {
        return moduleCode == null ? null : moduleRepository.findByModuleId(moduleCode).getName();
    }

    public int deleteAllNonExistantRatings() {
        return ratingRepository.deleteAllNonExistantRatings();
    }

    public int updateAllDepartmentNumReviews() {
        return departmentRepository.updateNumReviewsTotal() + departmentRepository.updateNumReviewsUsers();
    }

    public int updateAllModuleNumReviews() {
        return moduleRepository.updateNumReviewsTotal() + moduleRepository.updateNumReviewsUsers();
    }

    public Set<String> getModuleAcademicYearRange(String moduleCode) {
        Module module = entityManager.getReference(Module.class, moduleCode);
        if (module == null) return null;
        Set<AcademicYearProjection> academicYears = ratingRepository.findAllByModuleAndRatingPresentTrueAndLegalTrue(module);
        if (academicYears == null) return null;
        Set<String> result = new HashSet<>(academicYears.size());
        for (AcademicYearProjection academicYearProjection : academicYears) {
            result.add(academicYearProjection.getAcademicYear());
        }
        return result;
    }

    public Optional<Rating> getRating(String ratingId) {
        return ratingRepository.findById(ratingId);
    }

    public int deleteAllUserIllegalRatings(String userId) {
        return ratingRepository.updateIllegalRatingSetNotPresentForUser(userId);
    }

    public int deleteAllUserOrUniUserRatings(String userId, String uniId) {
        return ratingRepository.updateRatingSetNotPresentForUserOrUniUser(userId, uniId);
    }

    public List<Rating> getUserOrUniUserExistingRatings(String userId, String uniId) {
        return ratingRepository.findAllByRatingUserIdOrUniIdAndRatingPresentTrue(userId, uniId);
    }

    public Boolean likeRatingExistsByUserOrUniIdAndTargetRatingIdAndRatingExists(String uuid, String uniId, String targetRatingId) {
        return ratingRepository.existsRatingByRatingUserIdOrRatingUniUserAndTypeIdAndTargetRatingIdAndRatingPresent(uuid, uniId, RatingType.LIKE.id(), targetRatingId, true);
    }

    public Boolean ratingExistsByUserOrUniIdAndModuleAndTypeAndAcademicYearAndRatingExists(String uuid, String uniId, String moduleCode, int typeId, String academicYear) {
        Module module = entityManager.getReference(Module.class, moduleCode);
        if (module == null) return false;
        return ratingRepository.existsRatingByRatingUserIdOrRatingUniUserAndModuleAndTypeIdAndAcademicYearAndRatingPresent(uuid, uniId, module, typeId, academicYear, true);
    }

    public void writeRating(Rating rating) {
        ratingRepository.save(rating);
    }

    public Boolean moduleExists(String moduleCode) {
        return moduleRepository.existsByModuleId(moduleCode);
    }

    public List<Rating> getIllegalExistingRatings(String userId, String uniId) {
        return ratingRepository.findAllByRatingUserIdOrUniIdAndLegalFalseAndRatingPresentTrue(userId, uniId);
    }

    public List<Rating> getExistingRatings() {
        return ratingRepository.findAllByRatingPresentTrueAndLegalTrue();
    }

    // note: f may be null in which case don't filter by it
    public List<Rating> getExistingRatingsByModuleAndAcademicYearsAndGradesAndTypes(String moduleCode, Set<String> academicYears, Set<Grade> grades, Set<RatingType> types,  String uniId) {
        Module module = entityManager.getReference(Module.class, moduleCode);
        if (module == null) {
            return null;
        }
        List<String> academicYearsList = new ArrayList<>(academicYears);
        List<Integer> gradesList = new ArrayList<>(grades.size());
        for (Grade grade : grades) {
            gradesList.add(grade.id());
        }
        List<Integer> typeIds = new ArrayList<>(types.size());
        for (RatingType ratingType : types) {
            typeIds.add(ratingType.id());
        }
        if (uniId == null) {
            return ratingRepository.findAllByRatingPresentTrueAndLegalTrueAndModuleAndAcademicYearInAndGradeInAndTypeIdInOrderByTimeDesc(module, academicYearsList, gradesList, typeIds);
        }
        else {
            return ratingRepository.findAllByRatingPresentTrueAndLegalTrueAndModuleAndAcademicYearInAndGradeInAndTypeIdInAndUniIdOrderByTimeDesc(module, academicYearsList, gradesList, typeIds, uniId);
        }
    }

    public List<Rating> getExistingRatingsByModuleAndGradesAndTypes(String moduleCode, Set<Grade> grades, Set<RatingType> types, String uniId) {
        Module module = entityManager.getReference(Module.class, moduleCode);
        if (module == null) {
            return null;
        }
        List<Integer> gradesList = new ArrayList<>(grades.size());
        for (Grade grade : grades) {
            gradesList.add(grade.id());
        }
        List<Integer> typeIds = new ArrayList<>(types.size());
        for (RatingType ratingType : types) {
            typeIds.add(ratingType.id());
        }
        if (uniId == null) {
            return ratingRepository.findAllByRatingPresentTrueAndLegalTrueAndModuleAndGradeInAndTypeIdInOrderByTimeDesc(module, gradesList, typeIds);
        }
        else {
            return ratingRepository.findAllByRatingPresentTrueAndLegalTrueAndModuleAndGradeInAndTypeIdInAndUniIdOrderByTimeDesc(module, gradesList, typeIds, uniId);
        }
    }


    public Department getModuleDepartment(String moduleCode) {
        Optional<Module> optionalModule = moduleRepository.findById(moduleCode);
        if (optionalModule.isPresent()) {
            Module module = optionalModule.get();
            return module.getDepartment();
        }
        return null;
    }

    public void cleanupData() throws IllegalStateException {
        Optional<Department> cs = departmentRepository.findById("CS");
        if (!cs.isPresent()) {
            throw new IllegalStateException("Didn't import CS department!");
        }
        Department csDepartment = cs.get();
        csDepartment.setName("Computer Science"); // update CS's n from DCS to Computer Science
        departmentRepository.save(csDepartment);
        // delete all departments that have no modules
        Iterable<Department> departments = departmentRepository.findAll();
        for (Department department : departments) {
            if (department.getModules().size() == 0) {
                departmentRepository.deleteById(department.getDepartmentId());
            }
        }
    }

    // NOTE: skips not exists ratings!!
    public void loadFirebaseRatings() throws FirebaseDbException {
        Map<String, RatingBasicData> ratingBasicDataMap = firebaseDbApi.getRatings();
        if (ratingBasicDataMap == null) {
            return;
        }
        // firstly add all the non-recursive ratings (non-LIKE ratings) then all the recursive ones, since otherwise when reference the recursive one, the entity cannot be found

        ratingRepository.deleteAll();
        ratingUniUserRepository.deleteAll();

        Map<String, RatingBasicData> recursiveRatings = new HashMap<>();
        Map<String, RatingBasicData> nonRecursiveRatings = new HashMap<>();
        for (Map.Entry<String, RatingBasicData> ratingBasicDataEntry : ratingBasicDataMap.entrySet()) {
            RatingBasicData ratingBasicData = ratingBasicDataEntry.getValue();
            if (ratingBasicData.getC() == null) continue;
            RatingType ratingType = RatingType.fromId(ratingBasicData.getC());
            if (ratingType == null) continue;
            if (ratingType.isRecursive()) {
                recursiveRatings.put(ratingBasicDataEntry.getKey(), ratingBasicData);
            }
            else {
                nonRecursiveRatings.put(ratingBasicDataEntry.getKey(), ratingBasicData);
            }
        }

        // non-recursive ratings
        for (Map.Entry<String, RatingBasicData> ratingBasicDataEntry : nonRecursiveRatings.entrySet()) {
            RatingBasicData ratingBasicData = ratingBasicDataEntry.getValue();
            if (!ratingBasicData.getE()) {
                continue;
            }
            Rating rating = getRatingFromRatingBasicDataAndId(ratingBasicData, ratingBasicDataEntry.getKey());
            if (rating == null) continue;
            if (rating.getGrade() == null) {
                rating.setGrade(Grade.U.id());
            }
            // v2.5 METRICS DELTA
//            RatingType ratingType = RatingType.fromId(rating.getTypeId());
//            if (ratingType != null && ratingType.maxValue() == 3) {
//                // scale value, replace rating value with scaled value
//                int value;
//                try {
//                    value = Integer.parseInt(ratingBasicData.getV());
//                }
//                catch (NumberFormatException e) {
//                    System.out.println("FAILED TO SCALE RATING " + rating.getRatingId());
//                    e.printStackTrace();
//                    continue;
//                }
//                int scaledValue = value < 3 ? 1 : (value > 3 ? 3 : 2);
//                firebaseDbApi.writeRatingValue(rating.getRatingId(), String.valueOf(scaledValue));
//                rating.setValue(String.valueOf(scaledValue));
//                System.out.println("Scaled rating value " + value + " => " + scaledValue + " (id: " + rating.getRatingId() + ", type: " + ratingType.toString() + ")");
//            }
            ratingRepository.save(rating);
        }

        // recursive ratings
        for (Map.Entry<String, RatingBasicData> ratingBasicDataEntry : recursiveRatings.entrySet()) {
            RatingBasicData ratingBasicData = ratingBasicDataEntry.getValue();
            if (!ratingBasicData.getE()) {
                continue;
            }
            Rating rating = getRatingFromRatingBasicDataAndId(ratingBasicData, ratingBasicDataEntry.getKey());
            // skip rating if its target / parent does not exist anymore
            if (rating == null || rating.getTargetRating() == null || rating.getTargetRating().getRatingPresent() == null || !rating.getTargetRating().getRatingPresent()) continue;
            if (rating.getGrade() == null) {
                rating.setGrade(Grade.U.id());
            }
            ratingRepository.save(rating);
        }
    }

    public Rating getRatingFromRatingBasicDataAndId(RatingBasicData ratingBasicData, String ratingId) throws FirebaseDbException {
        Module m = entityManager.getReference(Module.class, ratingBasicData.getM());
        String uniId = ratingBasicData.getU();
        RatingUniUser ratingUniUser = getRatingUniUser(uniId);
        RatingType ratingType = RatingType.fromId(ratingBasicData.getC());
        if (ratingType.isRecursive()) {
            String targetRatingId = ratingBasicData.getP();
            if (targetRatingId == null) return null;
            Rating rating = entityManager.find(Rating.class, targetRatingId);
            if (rating == null) {
                return null;
            }
            return new Rating(
                    ratingId,
                    rating,
                    ratingBasicData.getE(),
                    TimeHelper.stringToDateTime(ratingBasicData.getT()),
                    ratingBasicData.getV().equals(LikeRatingConstants.LIKE_VALUE),
                    ratingBasicData.getY(),
                    ratingBasicData.getG() == null ? Grade.U.id() : ratingBasicData.getG(),
                    m,
                    ratingBasicData.getF(),
                    ratingUniUser,
                    true
            );
        }
        return new Rating(
                ratingId,
                ratingBasicData.getC(),
                ratingBasicData.getE(),
                TimeHelper.stringToDateTime(ratingBasicData.getT()),
                ratingBasicData.getV(),
                ratingBasicData.getY(),
                ratingBasicData.getG() == null ? Grade.U.id() : ratingBasicData.getG(),
                m,
                ratingBasicData.getF(),
                ratingUniUser,
                true
        );
    }

    // NOTE: DOES NOT UPDATE AGGREGATES!!
    public void auditAllUserRatings() {
        log.info("----- AUDITING ALL USER RATINGS -----\n");
        List<String> userIds = ratingRepository.findAllDistinctUserIds();
        if (userIds != null) {
            userIds.parallelStream().forEach(new Consumer<String>() {
                @Override
                public void accept(String userId) {
                    try {
                        log.info("--- AUDITING " + userId + " RATINGS ---");
                        auditUserRatings(userId);
                        log.info("--- DONE AUDITING " + userId + " RATINGS ---\n");
                    }
                    catch (FirebaseDbException e) {
                        log.error("AUDITING: ERROR AUDITING " + userId + " RATINGS", e);
                    }
                }
            });
        }
        log.info("\n----- DONE AUDITING ALL USER RATINGS -----");
    }

    private List<Rating> auditUserRatings(String userId) throws FirebaseDbException {
        String uniId = firebaseDbApi.getUserPrimaryUniId(userId);
        return auditUserOrUniUserRatings(userId, uniId);
    }

    // will process all of their ratings and set the correct "legal" and "ratingContext" fields
    private List<Rating> auditUserOrUniUserRatings(String userId, String uniId) throws FirebaseDbException {
        List<Rating> ratings = uniId == null ? ratingRepository.findAllByRatingUserId(userId) : ratingRepository.findAllByRatingUserIdOrRatingUniUser(userId, uniId);
        if (ratings == null) {
            return null;
        }
        // update anonymous setting
        if (uniId != null) {
            Boolean anonymous = firebaseDbApi.getUniUserAnonymous(uniId);
            if (anonymous == null) {
                anonymous = Constants.DEFAULT_ANONYMOUS_SETTING;
            }
            updateUniUserAnonymous(uniId, anonymous);
        }

        // get the uni ids that span the user's ratings, and for each obtain their module registrations
        Map<String, List<ModuleRegistrationBasicData>> uniIdModuleRegistrations = new HashMap<>();
        for (Rating rating : ratings) {
            RatingUniUser ratingUniUser = rating.getRatingUniUser();
            String ratingUniId = ratingUniUser == null ? null : ratingUniUser.getUniId();
            if (ratingUniId == null) continue;
            if (!uniIdModuleRegistrations.containsKey(ratingUniId)) {
                List<ModuleRegistrationBasicData> ratingUniUserModuleRegistrations = firebaseDbApi.getUniUserModuleRegistrations(ratingUniId);
                if (ratingUniUserModuleRegistrations == null) ratingUniUserModuleRegistrations = Collections.emptyList();
                uniIdModuleRegistrations.put(ratingUniId, ratingUniUserModuleRegistrations);
            }
        }

        // now audit the ratings based upon the module registration truth as above
        List<Rating> changedRatings = new ArrayList<>();
        for (Rating rating : ratings) {
            // we seek a matching module registration for this rating and if found legal is true otherwise false
            RatingUniUser ratingUniUser = rating.getRatingUniUser();
            String ratingUniId = ratingUniUser == null ? null : ratingUniUser.getUniId();
            boolean legal = false;
            for (ModuleRegistrationBasicData moduleRegistration : uniIdModuleRegistrations.get(ratingUniId)) {
                String moduleCode = moduleRegistration.getM();
//                Integer grade = moduleRegistration.getG();
//                if (grade == null) grade = Grade.U.id();
//                Integer ratingGrade = rating.getGrade();
//                if (ratingGrade == null) ratingGrade = Grade.U.id();
                String academicYear = moduleRegistration.getY();
                if (
                        rating.getModule().getModuleId().equals(moduleCode)
//                                && grade.equals(ratingGrade)
                                && rating.getAcademicYear().equals(academicYear)
                ) {
                    legal = true;
                    break;
                }
            }
            if (legal != rating.getLegal()) {
                ratingRepository.updateRatingSetLegal(rating.getRatingId(), legal);
                changedRatings.add(rating);
            }
        }
        return changedRatings;
    }

    public List<Rating> auditUserRatingsAndUpdateAggregates(String userId, String uniId) throws FirebaseDbException {
        List<Rating> changedRatings = auditUserOrUniUserRatings(userId, uniId);
        if (changedRatings == null) {
            return null;
        }
        for (Rating rating : changedRatings) {
            if (!rating.getRatingPresent()) { // skip non-present ratings since aggregates only count towards existing ones and auditing doesn't change e
                continue;
            }
            // each rating object is the rating BEFORE the audit. so if the rating was legal then it was changed to illegal and therefore we subtract, and if the rating was not legal then it was changed to legal so we add
            boolean add = !rating.getLegal();
            aggregates.updateMetricAggregate(rating, add);
        }
        return changedRatings;
    }

    // sync uniUser.uniUserBasicData in DB to RatingUniUsers table
    public RatingUniUser loadRatingUniUser(String uniId) throws FirebaseDbException {
        // not present so generate, save into RatingUniUsers, and return
        UniUserBasicData uniUserBasicData = firebaseDbApi.getUniUserBasicData(uniId);
        RatingUniUser ratingUniUser = new RatingUniUser(uniId, null, null, null, Constants.DEFAULT_ANONYMOUS_SETTING);
        if (uniUserBasicData != null) {
            Department department = entityManager.getReference(Department.class, uniUserBasicData.getD());
            ratingUniUser.setDepartment(department);
            Boolean anonymous = uniUserBasicData.getA();
            if (anonymous == null) anonymous = Constants.DEFAULT_ANONYMOUS_SETTING;
            ratingUniUser.setAnonymous(anonymous);
            ratingUniUser.setFirstName(uniUserBasicData.getF());
            ratingUniUser.setLastName(uniUserBasicData.getL());
        }
        ratingUniUserRepository.save(ratingUniUser);
        return ratingUniUser;
    }

    public RatingUniUser getRatingUniUser(String uniId) throws FirebaseDbException {
        if (uniId == null) return null;
        Optional<RatingUniUser> ratingUniUserOptional = ratingUniUserRepository.findById(uniId);
        if (ratingUniUserOptional.isPresent()) {
            return ratingUniUserOptional.get();
        }
        return loadRatingUniUser(uniId);
    }

    /* DEPRECIATED
    // returns # of updated ratings
    public int updateUserRatingContexts(String userId, boolean anonymous) throws FirebaseDbException {
        // if a, set the ratingcontext of their ratings to null and then remove the ratingcontext
        if (anonymous) {
            int numAffected = ratingRepository.updateRatingSetNullRatingContextForUser(userId);
            if (ratingContextRepository.existsById(userId)) {
                ratingContextRepository.deleteById(userId);
            }
            return numAffected;
        }
        // if not a, try to obtain their ratingcontext and set the ratingcontext of their comment ratings to this ratingcontext
        else {
            RatingUniUser ratingContext = getUserRatingContext(userId);
            if (ratingContext != null) {
                return ratingRepository.updateRatingSetRatingContextOnCommentRatingsForUser(userId, ratingContext);
            }
        }
        return 0;
    }
     */
    public int updateUniUserAnonymous(String uniUser, boolean anonymous) {
        return ratingUniUserRepository.updateRatingUniUserSetAnonymous(uniUser, anonymous);
    }

    // returns the writed Rating object. returns null if failed
    public Rating writeRating(RatingBasicData ratingBasicData, String ratingId) throws FirebaseDbException {
        Rating rating = getRatingFromRatingBasicDataAndId(ratingBasicData, ratingId);
        if (rating == null) return null;
        writeRating(rating);
        return rating;
    }

//    private void loadFirebaseRoutes() throws FirebaseDbException {
//        Map<String, RouteBasicData> routeBasicDataMap =  firebaseDbApi.getRoutes();
//
//        Set<Route> routes = new HashSet<>();
//        for (Map.Entry<String, RouteBasicData> routeBasicDataEntry : routeBasicDataMap.entrySet()) {
//            RouteBasicData routeBasicData = routeBasicDataEntry.getV();
//            Route route = new Route(routeBasicDataEntry.getKey(), routeBasicData.getN(), routeBasicData.getDegreeType());
//            routes.add(route);
//        }
//
//        routeRepository.saveAll(routes);
//    }

    // should be called AFTER `loadFirebaseModules` since it appends to them
    public void loadFirebaseLeaders() throws FirebaseDbException {
        Map<String, Map<String, Course>> moduleAcademicYearCourseMap = firebaseDbApi.getCourses();
        if (moduleAcademicYearCourseMap == null) return;
        List<ModuleLeader> moduleLeaders = new ArrayList<>();
        moduleAcademicYearCourseMap.forEach((moduleCode, academicYearCourse) -> {
            Optional<Module> module = getModule(moduleCode);
            if (!module.isPresent()) return;
            academicYearCourse.forEach((academicYear, course) -> {
                Leader leader = course.getL();
                if (leader == null) return;
                ModuleLeader moduleLeader = new ModuleLeader(leader.getU(), leader.getN(), module.get(), academicYear);
                moduleLeaders.add(moduleLeader);
            });
        });
        moduleLeaderRepository.deleteAll();
        moduleLeaderRepository.saveAll(moduleLeaders);
    }

    public void loadFirebaseModules() throws FirebaseDbException {
        Map<String, ModuleBasicData> moduleBasicDataMap =  firebaseDbApi.getModules();
        if (moduleBasicDataMap == null) {
            return;
        }
        Set<Module> modules = new HashSet<>();
        for (Map.Entry<String, ModuleBasicData> moduleBasicDataEntry : moduleBasicDataMap.entrySet()) {
            ModuleBasicData moduleBasicData = moduleBasicDataEntry.getValue();
            //if (!moduleBasicData.getA()) continue; // skip inactive modules
            Department d = entityManager.getReference(Department.class, moduleBasicData.getD());
            String moduleName = moduleBasicDataEntry.getKey() + " - " + moduleBasicData.getN();
            Module module = new Module(moduleBasicDataEntry.getKey(), moduleName, moduleBasicData.getA(), d);
            modules.add(module);
        }
        moduleRepository.deleteAll();
        Iterable<Module> newModules = moduleRepository.saveAll(modules);
        for (Module module : newModules) {
            Department d =  module.getDepartment();
            d.addModule(module);
        }
    }

    public void loadFirebaseDepartments() throws FirebaseDbException {
        Map<String, DepartmentBasicData> departmentBasicDataMap =  firebaseDbApi.getDepartments();
        if (departmentBasicDataMap == null) {
            return;
        }

//        Map<String, List<String>> departmentModules = firebaseDbApi.getDepartmentModules();
//        Map<String, List<String>> departmentRoutes = firebaseDbApi.getDepartmentRoutes();

        Set<Department> departments = new HashSet<>();
        for (Map.Entry<String, DepartmentBasicData> departmentBasicDataEntry : departmentBasicDataMap.entrySet()) {
            String departmentId = departmentBasicDataEntry.getKey();
            DepartmentBasicData departmentBasicData = departmentBasicDataEntry.getValue();

//            Set<Module> modules = new HashSet<>();
//            for (String moduleId: departmentModules.get(d)) {
//                modules.add(entityManager.getReference(Module.class, moduleId));
//            }

//            Set<Route> routes = new HashSet<>();
//            if (departmentRoutes.containsKey(d)) {
//                for (String r : departmentRoutes.get(d)) {
//                    routes.add(entityManager.getReference(Route.class, r));
//                }
//            }
            Department department = new Department(departmentId, departmentBasicData.getN());
            departments.add(department);
        }
        departmentRepository.deleteAll();
        departmentRepository.saveAll(departments);
    }

    public List<Module> searchModulesBySubstringName(String nameSubstring, Pageable pageable) {
        return moduleRepository.findByNameIgnoreCaseContaining(nameSubstring, pageable).toList();
    }

    public List<Module> searchModulesBySubstringNameAndDepartmentCode(String nameSubstring, String departmentCode, Pageable pageable) {
        Department department = entityManager.getReference(Department.class, departmentCode);
        if (department == null) {
            return Collections.emptyList();
        }
        return moduleRepository.findByNameIgnoreCaseContainingAndDepartment(nameSubstring, department, pageable).toList();
    }

    public List<Module> searchModulesByDepartmentCode(String departmentCode, Pageable pageable) {
        Department department = entityManager.getReference(Department.class, departmentCode);
        if (department == null) {
            return Collections.emptyList();
        }
        return moduleRepository.findByDepartment(department, pageable).toList();
    }

    public Optional<Module> getModule(String moduleCode) {
        return moduleRepository.findById(moduleCode);
    }

    public Optional<Department> getDepartment(String departmentCode) {
        return departmentRepository.findById(departmentCode);
    }

    public List<Department> searchDepartmentsByCode(String departmentCode, Pageable pageable) {
        return departmentRepository.findByDepartmentIdIgnoreCaseContaining(departmentCode, pageable).toList();
    }

    public List<Department> searchDepartmentsByName(String departmentName, Pageable pageable) {
        return departmentRepository.findByNameIgnoreCaseContaining(departmentName, pageable).toList();
    }

    public List<Department> searchDepartmentsByNameOrCode(String departmentName, String departmentCode, Pageable pageable) {
        return departmentRepository.findByDepartmentIdIgnoreCaseContainingOrNameIgnoreCaseContaining(departmentCode, departmentName, pageable).toList();
    }

    public void deleteAllModules() {
        moduleRepository.deleteAll();
    }

    public void deleteAllRatings() {
        ratingRepository.deleteAll();
    }

    public void deleteAllRatingUniUsers() {
        ratingUniUserRepository.deleteAll();
    }

    public void deleteAllDepartments() {
        departmentRepository.deleteAll();
    }

    public void deleteAllModuleLeaders() {
        moduleLeaderRepository.deleteAll();
    }

//    public Optional<Route> getRoute(String r) {
//        return routeRepository.findById(r);
//    }
}
