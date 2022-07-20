package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModuleSearchQuery {
    private String moduleName;
    private String departmentCode;
    private Integer pageNumber;
    private Integer pageSize;
    private String sortBy = "rank";
    private Boolean sortAsc = true;

    private static Map<String, String> sortFieldMap = new HashMap<>(3);
    static {
        sortFieldMap.put("code", "moduleId");
        sortFieldMap.put("name", "name");
        sortFieldMap.put("rank", "numReviewsTotal");
    }

    public boolean valid() {
        boolean nullCheck = !(moduleName == null && departmentCode == null) && pageNumber != null && pageSize != null;
        if (!nullCheck) return false;
        boolean sortFieldCheck = sortFieldMap.containsKey(sortBy);
        if (!sortFieldCheck) return false;
        return pageNumber >= 0 && pageSize >= 0;
    }

    public Pageable getPageable() {
        boolean sortAscending = sortAsc == null || sortAsc;
        String sortField = sortFieldMap.get(sortBy);
        Sort sort = Sort.by(sortAscending ? Sort.Direction.ASC : Sort.Direction.DESC, sortField).and(Sort.by(Sort.Direction.ASC, "moduleId"));
        return PageRequest.of(pageNumber, pageSize, sort);
    }
}
