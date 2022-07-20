package me.omartanner.modulepal.api.dto;

public enum OAuthBeginResult {
    SUCCESS,
    TEMPORARY_TOKEN_REQUEST_FAILED,
    USER_LOOKUP_FAILED,
    COOLDOWN_CALCULATION_FAILED,
    AUTH_COOLDOWN_VIOLATED,
    NO_AUTHENTICATED_UNI_ACCOUNT,
    AUTH_CONTEXT_LOOKUP_FAILED
}