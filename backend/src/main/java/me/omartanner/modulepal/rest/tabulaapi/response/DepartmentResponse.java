package me.omartanner.modulepal.rest.tabulaapi.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.rest.tabulaapi.objects.Department;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponse extends Response {
    private Department department;
}
