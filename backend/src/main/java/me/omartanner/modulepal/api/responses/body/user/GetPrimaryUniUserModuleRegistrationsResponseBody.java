package me.omartanner.modulepal.api.responses.body.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.ModuleRegistration;

import java.util.List;

@Data
@AllArgsConstructor
public class GetPrimaryUniUserModuleRegistrationsResponseBody {
    private List<ModuleRegistration> moduleRegistrations;
}
