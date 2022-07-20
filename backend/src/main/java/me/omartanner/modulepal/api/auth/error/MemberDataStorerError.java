package me.omartanner.modulepal.api.auth.error;

import lombok.Getter;

public class MemberDataStorerError extends RuntimeException {
    @Getter
    private MemberDataStorerErrorType memberDataStorerErrorType;

    public MemberDataStorerError(MemberDataStorerErrorType memberDataStorerErrorType) {
        this.memberDataStorerErrorType = memberDataStorerErrorType;
    }
}
