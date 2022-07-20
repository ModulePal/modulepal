package me.omartanner.modulepal.rest.tabulaapi.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.rest.tabulaapi.objects.Department;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllDepartmentsResponse extends Response {
    private Set<Department> departments;
}
