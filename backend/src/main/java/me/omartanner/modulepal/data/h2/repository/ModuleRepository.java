package me.omartanner.modulepal.data.h2.repository;


import me.omartanner.modulepal.data.h2.model.Department;
import me.omartanner.modulepal.data.h2.model.Module;
import me.omartanner.modulepal.data.h2.repository.projection.ModuleNameProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface ModuleRepository extends PagingAndSortingRepository<Module, String> {
    Page<Module> findByName(String name, Pageable pageable);
    Page<Module> findByNameIgnoreCaseContaining(String name, Pageable pageable);
    Page<Module> findByDepartment(Department department, Pageable pageable);
    Page<Module> findByNameIgnoreCaseContainingAndDepartment(String name, Department department, Pageable pageable);
    Boolean existsByModuleId(String moduleId);

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "UPDATE MODULE M SET M.NUM_REVIEWS_TOTAL = (SELECT COUNT(*) FROM RATING R WHERE R.RATING_EXISTS = TRUE AND R.LEGAL = TRUE AND R.MODULE_ID = M.MODULE_ID AND R.TYPE_ID != 12)")
    int updateNumReviewsTotal();

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "UPDATE MODULE M SET M.NUM_REVIEWS_USERS = (SELECT COUNT(DISTINCT RATING_UNI_USER) FROM RATING R WHERE R.RATING_EXISTS = TRUE AND R.LEGAL = TRUE AND R.MODULE_ID = M.MODULE_ID AND R.TYPE_ID != 12)")
    int updateNumReviewsUsers();

    ModuleNameProjection findByModuleId(String moduleId);

//    @Modifying
//    @Transactional
//    @Validated
//    @Query("UPDATE Module m SET m.rank = (SELECT COUNT(*) FROM Rating r WHERE r.ratingExists = TRUE AND r.legal = TRUE AND r.moduleId = m.moduleId) WHERE m.moduleId = :moduleId")
//    int updateRank(@Param("moduleId") String moduleId);
}
