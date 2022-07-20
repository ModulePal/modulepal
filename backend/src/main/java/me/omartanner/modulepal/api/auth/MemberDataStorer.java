package me.omartanner.modulepal.api.auth;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.api.auth.error.MemberDataStorerError;
import me.omartanner.modulepal.api.auth.error.MemberDataStorerErrorType;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.moduleregistration.ModuleRegistrationBasicData;
import me.omartanner.modulepal.data.firebase.db.objects.nodes.uniuser.UniUserBasicData;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.rest.tabulaapi.objects.Member;
import me.omartanner.modulepal.rest.tabulaapi.objects.ModuleRegistration;
import me.omartanner.modulepal.rest.tabulaapi.objects.StudentCourseDetails;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
@Slf4j
public class MemberDataStorer {
    @Autowired
    FirebaseDbApi firebaseDbApi;

    @Autowired
    H2Manager h2Manager;

    // not null arguments
    public void storeMemberData(@NotNull Member member, @NotNull String uniId, boolean anonymous, LocalDateTime timeMemberRetrieved) throws MemberDataStorerError {
        if (member.getHomeDepartment() == null || member.getHomeDepartment().getCode() == null) {
            throw new MemberDataStorerError(MemberDataStorerErrorType.NO_HOME_DEPARTMENT);
        }
        String adminDepartmentCode = member.getHomeDepartment().getCode().toUpperCase();

        Set<StudentCourseDetails> studentCourseDetailsSet = member.getStudentCourseDetails();
        if (studentCourseDetailsSet == null) {
            studentCourseDetailsSet = new HashSet<>();
        }
        Set<ModuleRegistration> moduleRegistrations = new HashSet<>();
        StudentCourseDetails currentCourse = null;
        for (StudentCourseDetails studentCourseDetails : studentCourseDetailsSet) {
//            CurrentRoute currentRoute = studentCourseDetails.getCurrentRoute();
            if (currentCourse == null || studentCourseDetails.getMostSignificant()) {
                currentCourse = studentCourseDetails;
            }
            // add module r to super set
            moduleRegistrations.addAll(studentCourseDetails.getModuleRegistrations());
        }

        StudentCourseDetails currentCourseDetails = currentCourse;
//        String routeId = currentCourseDetails == null ? null : currentCourseDetails.getCurrentRoute().getCode().toUpperCase();

        UniUserBasicData uniUserBasicData = new UniUserBasicData(
                member.getFirstName(),
                member.getLastName(),
                member.getEmail(),
                adminDepartmentCode,
                false,
                anonymous
                );

        // extract and store module r
        ModuleRegistrationBasicData[] moduleRegistrationsBasicData = moduleRegistrations
                .stream()
                .map(moduleRegistration -> new ModuleRegistrationBasicData(moduleRegistration, uniId))
                .toArray(ModuleRegistrationBasicData[]::new);

        try {
            firebaseDbApi.writeNewModuleRegistrationsAndIndexes(moduleRegistrationsBasicData);
        }
        catch (FirebaseDbException e) {
            log.error("MEMBER DATA STORER: FAILED TO WRITE MODULE REGISTRATION BASIC DATA OR INDEXES TO FIREBASE", e);
            throw new MemberDataStorerError(MemberDataStorerErrorType.FAILED_TO_WRITE_MODULE_REGISTRATION_BASIC_DATA_OR_INDEXES);
        }

        // store UniUserBasicData and module registrations time
        uniUserBasicData.setM(true);
        try {
            firebaseDbApi.writeUniUserBasicData(uniUserBasicData, uniId);
            firebaseDbApi.writeUniUserModuleRegistrationsTime(uniId, timeMemberRetrieved);
            h2Manager.loadRatingUniUser(uniId);
        }
        catch (FirebaseDbException e) {
            log.error("MEMBER DATA STORER: FAILED TO WRITE UNI USER BASIC DATA TO FIREBASE, OR WRITE MODULE REGISTRATIONS TIME, OR UPDATE IN H2 (uniUserBasicData: " + uniUserBasicData.toString() + ", u: " + uniId + ")", e);
            throw new MemberDataStorerError(MemberDataStorerErrorType.FAILED_TO_WRITE_UNI_USER_BASIC_DATA);
        }
    }
}
