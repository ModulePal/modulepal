import { Consent } from "../../dto/Consent";

export interface AuthCheckResponseBody {
    authCooldownSeconds: number | null,
    consent: Consent | null
}