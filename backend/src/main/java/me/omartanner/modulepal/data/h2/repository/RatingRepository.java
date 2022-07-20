package me.omartanner.modulepal.data.h2.repository;

import me.omartanner.modulepal.data.h2.model.Module;
import me.omartanner.modulepal.data.h2.model.Rating;
import me.omartanner.modulepal.data.h2.repository.projection.AcademicYearProjection;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;

@Repository
public interface RatingRepository extends PagingAndSortingRepository<Rating, String> {
//    @Query(v = "SELECT r FROM Rating r WHERE r.ratingPresent is true")
    List<Rating> findAllByRatingPresentTrueAndLegalTrue();
    List<Rating> findAllByRatingPresentTrueAndLegalTrueAndModuleAndAcademicYearInAndGradeInAndTypeIdInOrderByTimeDesc(Module module, List<String> academicYears, List<Integer> grades, List<Integer> typeIds);

    @Query("SELECT r FROM Rating r WHERE r.ratingPresent = true AND r.legal = true AND r.module = :module AND (r.academicYear in :academicYears) AND (r.grade IN :grades) AND (r.typeId IN :typeIds) AND r.ratingUniUser.uniId = :uniId")
    List<Rating> findAllByRatingPresentTrueAndLegalTrueAndModuleAndAcademicYearInAndGradeInAndTypeIdInAndUniIdOrderByTimeDesc(
            @Param("module") Module module,
            @Param("academicYears") List<String> academicYears,
            @Param("grades") List<Integer> grades,
            @Param("typeIds") List<Integer> typeIds,
            @Param("uniId") String uniId);
    // all academic years
    List<Rating> findAllByRatingPresentTrueAndLegalTrueAndModuleAndGradeInAndTypeIdInOrderByTimeDesc(Module module, List<Integer> grades, List<Integer> typeIds);

    @Query("SELECT r FROM Rating r WHERE r.ratingPresent = true AND r.legal = true AND r.module = :module AND (r.grade IN :grades) AND (r.typeId IN :typeIds) AND r.ratingUniUser.uniId = :uniId")
    List<Rating> findAllByRatingPresentTrueAndLegalTrueAndModuleAndGradeInAndTypeIdInAndUniIdOrderByTimeDesc(
            @Param("module") Module module,
            @Param("grades") List<Integer> grades,
            @Param("typeIds") List<Integer> typeIds,
            @Param("uniId") String uniId);

    @Query(value = "SELECT CASE WHEN count(r)> 0 THEN true ELSE false END FROM Rating r WHERE (r.ratingUserId = :userId OR r.ratingUniUser.uniId = :uniId) AND (r.typeId IN :typeIds) AND r.targetRating.ratingId = :targetRatingId AND r.ratingPresent = :ratingPresent")
    Boolean existsRatingByRatingUserIdOrRatingUniUserAndTypeIdAndTargetRatingIdAndRatingPresent(
            @Param("userId") String userId,
            @Param("uniId") String uniId,
            @Param("typeIds") Integer typeId,
            @Param("targetRatingId") String targetRatingId,
            @Param("ratingPresent") Boolean ratingPresent);

    @Query(value = "SELECT CASE WHEN count(r)> 0 THEN true ELSE false END FROM Rating r WHERE (r.ratingUserId = :userId OR r.ratingUniUser.uniId = :uniId) AND r.module = :module AND (r.typeId IN :typeIds) AND r.academicYear = :academicYear AND r.ratingPresent = :ratingPresent")
    Boolean existsRatingByRatingUserIdOrRatingUniUserAndModuleAndTypeIdAndAcademicYearAndRatingPresent(
            @Param("userId") String userId,
            @Param("uniId") String uniId,
            @Param("module") Module module,
            @Param("typeIds") Integer typeId,
            @Param("academicYear") String academicYear,
            @Param("ratingPresent") Boolean ratingPresent);

    Set<AcademicYearProjection> findAllByModule(Module module);

    Set<AcademicYearProjection> findAllByModuleAndRatingPresentTrueAndLegalTrue(Module module);


    @Modifying
    @Transactional
    @Query("SELECT r FROM Rating r WHERE (r.ratingUserId = :userId OR r.ratingUniUser.uniId = :uniId) AND r.legal = false AND r.ratingPresent = true")
    List<Rating> findAllByRatingUserIdOrUniIdAndLegalFalseAndRatingPresentTrue(@Param("userId") String userId, @Param("uniId") String uniId);

    // UPDATE MODULE M SET M.RANK = (SELECT COUNT(*) FROM RATING R WHERE R.RATING_EXISTS = TRUE AND R.LEGAL = TRUE AND R.MODULE_ID = M.MODULE_ID AND R.TYPE_ID != 12)
    @Modifying
    @Transactional
    @Query(nativeQuery = true, value="DELETE FROM RATING R WHERE R.RATING_EXISTS = FALSE OR (R.TARGET_RATING_ID IS NOT NULL AND (NOT EXISTS (SELECT * FROM RATING RT WHERE RT.RATING_ID = R.TARGET_RATING_ID AND RT.RATING_EXISTS = TRUE)))")
    int deleteAllNonExistantRatings();

    @Modifying
    @Transactional
    @Query("UPDATE Rating r SET r.legal = :legal WHERE r.ratingId = :ratingId")
    int updateRatingSetLegal(@Param("ratingId") String ratingId, @Param("legal") boolean legal);

    List<Rating> findAllByRatingUserId(String ratingUserId);

    @Modifying
    @Transactional
    @Query("SELECT r FROM Rating r WHERE r.ratingUserId = :ratingUserId OR r.ratingUniUser.uniId = :ratingUniId")
    List<Rating> findAllByRatingUserIdOrRatingUniUser(@Param("ratingUserId") String ratingUserId, @Param("ratingUniId") String ratingUniId);

    @Modifying
    @Transactional
    @Query("SELECT r FROM Rating r WHERE (r.ratingUserId = :ratingUserId OR r.ratingUniUser.uniId = :uniId) AND r.ratingPresent = true")
    List<Rating> findAllByRatingUserIdOrUniIdAndRatingPresentTrue(@Param("ratingUserId") String ratingUserId, @Param("uniId") String uniId);

    @Modifying
    @Transactional
    @Query("UPDATE Rating r SET r.ratingPresent = false WHERE (r.ratingUserId = :userId OR r.ratingUniUser.uniId = :uniId) AND r.ratingPresent = true")
    int  updateRatingSetNotPresentForUserOrUniUser(@Param("userId") String userId, @Param("uniId") String uniId);

    @Modifying
    @Transactional
    @Query("UPDATE Rating r SET r.ratingPresent = false WHERE r.ratingUserId = :userId AND r.ratingPresent = true AND r.legal = false")
    int updateIllegalRatingSetNotPresentForUser(@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query("UPDATE Rating r SET r.legal = false WHERE r.ratingUserId = :userId AND r.legal = true")
    int  updateRatingSetIllegalForUser(@Param("userId") String userId);

    @Query("SELECT DISTINCT r.ratingUserId FROM Rating r WHERE r.ratingPresent = true")
    List<String> findAllDistinctUserIds();

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.ratingPresent = true AND r.legal = true AND r.ratingUniUser.uniId = :uniId AND r.module.moduleId = :moduleId")
    int getNumRatingsFromUniUserOnModule(@Param("uniId") String uniId, @Param("moduleId") String moduleId);
}

