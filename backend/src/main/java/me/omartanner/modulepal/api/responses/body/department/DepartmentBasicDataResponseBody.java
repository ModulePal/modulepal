package me.omartanner.modulepal.api.responses.body.department;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.DepartmentBasicData;

@Data
@AllArgsConstructor
public class DepartmentBasicDataResponseBody {
    private DepartmentBasicData departmentBasicData;
}
