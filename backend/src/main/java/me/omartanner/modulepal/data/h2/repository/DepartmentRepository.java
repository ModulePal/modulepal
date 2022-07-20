package me.omartanner.modulepal.data.h2.repository;

import me.omartanner.modulepal.data.h2.model.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.transaction.Transactional;

public interface DepartmentRepository extends PagingAndSortingRepository<Department, String> {
    Page<Department> findByDepartmentIdIgnoreCaseContaining(String departmentId, Pageable pageable);
    Page<Department> findByNameIgnoreCaseContaining(String name, Pageable pageable);
    Page<Department> findByDepartmentIdIgnoreCaseContainingOrNameIgnoreCaseContaining(String departmentId, String name, Pageable pageable);

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "UPDATE DEPARTMENT D SET D.NUM_REVIEWS_TOTAL = (SELECT COUNT(*) FROM RATING R WHERE R.RATING_EXISTS = TRUE AND R.LEGAL = TRUE  AND R.TYPE_ID != 12 AND R.MODULE_ID IN (SELECT MODULE_ID FROM MODULE WHERE DEPARTMENT_ID = D.DEPARTMENT_ID))")
    int updateNumReviewsTotal();

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "UPDATE DEPARTMENT D SET D.NUM_REVIEWS_USERS = (SELECT COUNT(DISTINCT RATING_UNI_USER) FROM RATING R WHERE R.RATING_EXISTS = TRUE AND R.LEGAL = TRUE  AND R.TYPE_ID != 12 AND R.MODULE_ID IN (SELECT MODULE_ID FROM MODULE WHERE DEPARTMENT_ID = D.DEPARTMENT_ID))")
    int updateNumReviewsUsers();
}
