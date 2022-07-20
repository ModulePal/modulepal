package me.omartanner.modulepal.helper.error;

import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;

@Slf4j
public class ErrorLogging {
    public static void logApiError(@NotNull String endpoint, @NotNull String contextMessage, Integer responseErrorId, Exception e) {
      String errorMessage = "ERROR " + endpoint + "\nCONTEXT: " + contextMessage;
      if (responseErrorId != null) {
          errorMessage += "\nRESPONSE ERROR ID: " + responseErrorId;
      }
      if (e == null) {
          log.error(errorMessage);
      }
      else {
          log.error(errorMessage, e);
      }
    }

    public static void logFailedToGetEmailVerifiedUser(@NotNull String endpoint, Integer responseErrorId, String extraContextMessage, @NotNull String firebaseTokenId) {
        String contextMessage = "FIREBASE TOKEN: " + firebaseTokenId;
        if (extraContextMessage != null) {
            contextMessage += "\nEXTRA CONTEXT: " + extraContextMessage;
        }
        logApiError(endpoint, contextMessage, responseErrorId, null);
    }

    public static void logFailedToGetUser(@NotNull String endpoint, Integer responseErrorId, String extraContextMessage, @NotNull String firebaseTokenId) {
        String contextMessage = "FIREBASE TOKEN: " + firebaseTokenId;
        if (extraContextMessage != null) {
            contextMessage += "\nEXTRA CONTEXT: " + extraContextMessage;
        }
        logApiError(endpoint, contextMessage, responseErrorId, null);
    }
}
