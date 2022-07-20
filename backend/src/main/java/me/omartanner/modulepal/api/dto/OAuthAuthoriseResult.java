package me.omartanner.modulepal.api.dto;

public enum OAuthAuthoriseResult {
    SUCCESS,
    TOKEN_SECRET_LOOKUP_FAILED,
    ACCESS_TOKEN_REQUEST_FAILED,
    NO_ID_MATCH_IN_ATTRIBUTES,
    ATTRIBUTES_REQUEST_FAILED,
    MULTIPLE_ID_MATCH_IN_ATTRIBUTES,
    AUTH_CONTEXT_LOOKUP_FAILED,
    NO_AUTHENTICATED_UNI_ACCOUNT,
    COOLDOWN_CALCULATION_FAILED,
    ILLEGAL_UNI_ID_CHANGE,
    AUTHENTICATED_UNI_ID_LOOKUP_FAILED,
    MEMBER_REQUEST_FAILED,
    AUTH_COOLDOWN_VIOLATED,
    UNI_ID_CHANGED_ON_UPDATE_DATA,
    MEMBER_STORE_FAILED,
    NO_CONSENT
}