package me.omartanner.modulepal.api.responses.error;

import me.omartanner.modulepal.api.auth.error.MemberDataStorerError;
import me.omartanner.modulepal.api.auth.error.MemberDataStorerErrorType;
import me.omartanner.modulepal.api.auth.error.UniUserModuleRegistrationDeleterError;
import me.omartanner.modulepal.api.auth.error.UniUserModuleRegistrationDeleterErrorType;
import me.omartanner.modulepal.api.dto.OAuthAuthoriseResult;
import me.omartanner.modulepal.api.dto.OAuthBeginResult;
import me.omartanner.modulepal.api.responses.Response;

import java.util.HashMap;
import java.util.Map;

public class AuthErrorResponse<T> extends Response<T> {
    private static Map<OAuthBeginResult, Integer> beginRrrorIdMap = new HashMap<>();
    private static Map<OAuthAuthoriseResult, Integer> authoriseErrorIdMap = new HashMap<>();
    private static Map<MemberDataStorerErrorType, Integer> memberDataStorerErrorIdMap = new HashMap<>();
    private static Map<UniUserModuleRegistrationDeleterErrorType, Integer> uniUserModuleRegistrationDeleterErrorIdMap = new HashMap<>();

    static {
        beginRrrorIdMap.put(OAuthBeginResult.TEMPORARY_TOKEN_REQUEST_FAILED, 20);
        beginRrrorIdMap.put(OAuthBeginResult.COOLDOWN_CALCULATION_FAILED, 21);
        beginRrrorIdMap.put(OAuthBeginResult.AUTH_COOLDOWN_VIOLATED, 22);
        beginRrrorIdMap.put(OAuthBeginResult.NO_AUTHENTICATED_UNI_ACCOUNT, 23);
        beginRrrorIdMap.put(OAuthBeginResult.AUTH_CONTEXT_LOOKUP_FAILED, 24);


        authoriseErrorIdMap.put(OAuthAuthoriseResult.AUTH_COOLDOWN_VIOLATED, 22); // same as begin
        authoriseErrorIdMap.put(OAuthAuthoriseResult.TOKEN_SECRET_LOOKUP_FAILED, 30);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.ACCESS_TOKEN_REQUEST_FAILED, 31);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.NO_ID_MATCH_IN_ATTRIBUTES, 32);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.MULTIPLE_ID_MATCH_IN_ATTRIBUTES, 33);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.ATTRIBUTES_REQUEST_FAILED, 34);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.ILLEGAL_UNI_ID_CHANGE, 35);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.AUTHENTICATED_UNI_ID_LOOKUP_FAILED, 36);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.MEMBER_REQUEST_FAILED, 37);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.UNI_ID_CHANGED_ON_UPDATE_DATA, 38);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.NO_CONSENT, 39);
        authoriseErrorIdMap.put(OAuthAuthoriseResult.AUTH_CONTEXT_LOOKUP_FAILED, 24); // same as begin
        authoriseErrorIdMap.put(OAuthAuthoriseResult.NO_AUTHENTICATED_UNI_ACCOUNT, 23); // same as begin
        authoriseErrorIdMap.put(OAuthAuthoriseResult.COOLDOWN_CALCULATION_FAILED, 21); // same as begin

        memberDataStorerErrorIdMap.put(MemberDataStorerErrorType.NO_STUDENT_COURSE_DETAILS, 40);
        memberDataStorerErrorIdMap.put(MemberDataStorerErrorType.NO_HOME_DEPARTMENT, 41);
        memberDataStorerErrorIdMap.put(MemberDataStorerErrorType.FAILED_TO_WRITE_MODULE_REGISTRATION_BASIC_DATA_OR_INDEXES, 42);
        memberDataStorerErrorIdMap.put(MemberDataStorerErrorType.FAILED_TO_WRITE_UNI_USER_BASIC_DATA, 44);

        uniUserModuleRegistrationDeleterErrorIdMap.put(UniUserModuleRegistrationDeleterErrorType.FAILED_TO_OBTAIN_UNI_USER_MODULE_REGISTRATION_IDS, 45);
        uniUserModuleRegistrationDeleterErrorIdMap.put(UniUserModuleRegistrationDeleterErrorType.FAILED_TO_DELETE_UNI_USER_MODULE_REGISTRATIONS, 46);
    }

    public AuthErrorResponse(OAuthBeginResult oAuthBeginResult) {
        super(false, beginRrrorIdMap.get(oAuthBeginResult), null);
    }

    public AuthErrorResponse(OAuthAuthoriseResult oAuthAuthoriseResult) {
        super(false, authoriseErrorIdMap.get(oAuthAuthoriseResult), null);
    }

    public AuthErrorResponse(MemberDataStorerError memberDataStorerError) {
        this(memberDataStorerError.getMemberDataStorerErrorType());
    }

    public AuthErrorResponse(UniUserModuleRegistrationDeleterError uniUserModuleRegistrationDeleterError) {
        this(uniUserModuleRegistrationDeleterError.getUniUserModuleRegistrationDeleterErrorType());
    }

    public AuthErrorResponse(MemberDataStorerErrorType memberDataStorerErrorType) {
        super(false, memberDataStorerErrorIdMap.get(memberDataStorerErrorType), null);
    }

    public AuthErrorResponse(UniUserModuleRegistrationDeleterErrorType uniUserModuleRegistrationDeleterErrorType) {
        super(false, uniUserModuleRegistrationDeleterErrorIdMap.get(uniUserModuleRegistrationDeleterErrorType), null);
    }
}