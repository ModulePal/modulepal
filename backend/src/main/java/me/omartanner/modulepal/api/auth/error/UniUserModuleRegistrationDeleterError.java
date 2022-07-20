package me.omartanner.modulepal.api.auth.error;

import lombok.Getter;

public class UniUserModuleRegistrationDeleterError extends RuntimeException {
    @Getter
    private UniUserModuleRegistrationDeleterErrorType uniUserModuleRegistrationDeleterErrorType;

    public UniUserModuleRegistrationDeleterError(UniUserModuleRegistrationDeleterErrorType uniUserModuleRegistrationDeleterErrorType) {
        this.uniUserModuleRegistrationDeleterErrorType = uniUserModuleRegistrationDeleterErrorType;
    }
}
