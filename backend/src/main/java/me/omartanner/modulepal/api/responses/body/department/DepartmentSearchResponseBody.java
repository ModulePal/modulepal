package me.omartanner.modulepal.api.responses.body.department;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.DepartmentSearchData;

import java.util.List;

@Data
@AllArgsConstructor
public class DepartmentSearchResponseBody {
    private List<DepartmentSearchData> departments;
}
