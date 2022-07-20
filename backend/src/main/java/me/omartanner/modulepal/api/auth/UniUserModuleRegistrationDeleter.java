package me.omartanner.modulepal.api.auth;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.api.auth.error.UniUserModuleRegistrationDeleterError;
import me.omartanner.modulepal.api.auth.error.UniUserModuleRegistrationDeleterErrorType;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
@Slf4j
public class UniUserModuleRegistrationDeleter {
    @Autowired
    private FirebaseDbApi firebaseDbApi;

    public void deleteUniUserModuleRegistrations(String uniId) throws UniUserModuleRegistrationDeleterError {
        Collection<String> registrationIds;
        try {
            registrationIds = firebaseDbApi.getUniUserModuleRegistrationKeys(uniId);
        }
        catch (FirebaseDbException e) {
            log.error("UNI USER MODULE REGISTRATION DELETER: FAILED TO OBTAIN UNI USER MODULE REGISTRATION IDS FROM FIREBASE (u: " + uniId + ")", e);
            throw new UniUserModuleRegistrationDeleterError(UniUserModuleRegistrationDeleterErrorType.FAILED_TO_OBTAIN_UNI_USER_MODULE_REGISTRATION_IDS);
        }

        try {
            firebaseDbApi.deleteUniUserModuleRegistrations(uniId);
            if (registrationIds != null) {
                firebaseDbApi.deleteModuleRegistrationsBasicData(registrationIds);
            }
        }
        catch (FirebaseDbException e) {
            log.error("UNI USER MODULE REGISTRATION DELETER: FAILED TO DELETE UNI USER MODULE REGISTRATIONS FROM FIREBASE (u: " + uniId + ", registrationIds: " + registrationIds.toString() + ")", e);
            throw new UniUserModuleRegistrationDeleterError(UniUserModuleRegistrationDeleterErrorType.FAILED_TO_DELETE_UNI_USER_MODULE_REGISTRATIONS);
        }
    }
}
