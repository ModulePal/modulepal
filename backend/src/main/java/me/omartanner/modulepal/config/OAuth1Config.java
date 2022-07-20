package me.omartanner.modulepal.config;

import me.omartanner.modulepal.data.firebase.db.FirebaseDbApi;
import me.omartanner.modulepal.data.firebase.db.FirebaseDbException;
import oauth1.OAuth1WithCallback;
import oauth1.exception.TokenMapException;
import oauth1.strategy.TokenMapStrategy;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class OAuth1Config {
    public static OAuth1WithCallback getOAuth1WithCallback(String callbackUrl, FirebaseDbApi firebaseDbApi) {
        return new OAuth1WithCallback(
                System.getenv("OAUTH_CONSUMER_KEY"),
                System.getenv("OAUTH_CLIENT_SHARED_SECRET"),
                "https://websignon.warwick.ac.uk/oauth/requestToken?scope=urn:websignon.warwick.ac.uk:sso:service+urn:tabula.warwick.ac.uk:tabula:service",
                callbackUrl,
                "https://websignon.warwick.ac.uk/oauth/authorise",
                "https://websignon.warwick.ac.uk/oauth/accessToken",
                new TokenMapStrategy() {
                    @Override
                    public void mapTemporaryTokenToTemporaryTokenSecret(@NotNull String s, @NotNull String s1) throws TokenMapException {
                        try {
                            firebaseDbApi.mapOAuthTemporaryTokenSecret(s, s1);
                        }
                        catch (FirebaseDbException e) {
                            throw new TokenMapException(e);
                        }
                    }

                    @Nullable
                    @Override
                    public String fetchTemporaryTokenSecretForTemporaryToken(@NotNull String s) throws TokenMapException {
                        try {
                            return firebaseDbApi.getOAuthTemporaryTokenSecret(s);
                        }
                        catch (FirebaseDbException e) {
                            throw new TokenMapException(e);
                        }
                    }
                }
        );
    }
}
