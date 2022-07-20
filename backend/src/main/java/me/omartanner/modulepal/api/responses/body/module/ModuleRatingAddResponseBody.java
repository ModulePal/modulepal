package me.omartanner.modulepal.api.responses.body.module;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ModuleRatingAddResponseBody {
    private List<String> newRatingIds; // rating id of each new rating in-tern
}
