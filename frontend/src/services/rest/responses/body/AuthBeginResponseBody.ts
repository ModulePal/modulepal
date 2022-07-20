export interface AuthBeginResponseBody {
    redirectUrl: string,
    oauthTempToken: string,
    authCooldownSeconds: number | null
}