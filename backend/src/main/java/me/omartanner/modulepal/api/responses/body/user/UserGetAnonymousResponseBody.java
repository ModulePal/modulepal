package me.omartanner.modulepal.api.responses.body.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserGetAnonymousResponseBody {
    private Boolean anonymous;
}
