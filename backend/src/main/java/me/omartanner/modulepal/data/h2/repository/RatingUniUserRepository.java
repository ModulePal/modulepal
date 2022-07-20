package me.omartanner.modulepal.data.h2.repository;

import me.omartanner.modulepal.data.h2.model.RatingUniUser;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;


@Repository
public interface RatingUniUserRepository extends CrudRepository<RatingUniUser, String> {
    @Modifying
    @Transactional
    @Query("UPDATE RatingUniUser r SET r.anonymous = :anonymous WHERE r.uniId = :uniId")
    int updateRatingUniUserSetAnonymous(@Param("uniId") String uniId, @Param("anonymous") boolean anonymous);
}

