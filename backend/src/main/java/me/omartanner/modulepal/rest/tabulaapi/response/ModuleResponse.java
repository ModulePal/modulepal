package me.omartanner.modulepal.rest.tabulaapi.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.rest.tabulaapi.objects.Module;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModuleResponse extends Response {
    private Module module;
}
