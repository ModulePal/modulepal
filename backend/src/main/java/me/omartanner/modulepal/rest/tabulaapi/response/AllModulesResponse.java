package me.omartanner.modulepal.rest.tabulaapi.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.rest.tabulaapi.objects.Module;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllModulesResponse extends Response {
    private Set<Module> modules;
}
