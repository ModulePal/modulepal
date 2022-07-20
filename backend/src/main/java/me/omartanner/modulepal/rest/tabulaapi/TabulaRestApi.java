package me.omartanner.modulepal.rest.tabulaapi;

import me.omartanner.modulepal.rest.ApiResponse;
import me.omartanner.modulepal.rest.tabulaapi.response.*;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
public class TabulaRestApi {
    @Autowired
    private ExternalUserTabulaRequestHandler externalUserTabulaRequestHandler;

    public ApiResponse<AllDepartmentsResponse> getAllDepartments() throws IOException {
        return externalUserTabulaRequestHandler.makeGetRequest("department", AllDepartmentsResponse.class);
    }

    public ApiResponse<DepartmentResponse> getDepartment(String departmentCode) throws IOException {
        return externalUserTabulaRequestHandler.makeGetRequest("department/" + departmentCode, DepartmentResponse.class);
    }

    public ApiResponse<AllModulesResponse> getAllModules() throws IOException {
        return externalUserTabulaRequestHandler.makeGetRequest("module", AllModulesResponse.class);
    }

    public ApiResponse<ModuleResponse> getModule(String moduleCode) throws IOException {
        return externalUserTabulaRequestHandler.makeGetRequest("module/" + moduleCode, ModuleResponse.class);
    }

    public ApiResponse<MemberResponse> getMember(String universityId, Set<String> fields) throws IOException {
        String endpoint = "member/" + universityId;
        String fieldsParam = String.join(",", fields);
        Map<String, String> queryParams = new HashMap<>(1);
        queryParams.put("fields", fieldsParam);
        return externalUserTabulaRequestHandler.makeGetRequest(endpoint, queryParams, MemberResponse.class);
    }

    public ApiResponse<MemberResponse> getMember(String universityId) throws IOException {
        return getMember(universityId, Collections.emptySet());
    }

    public ApiResponse<MultipleMembersResponse> getMultipleMembers(Set<String> universityIds, Set<String> fields) throws IOException {
        Set<String> universityIdsParams = new HashSet<>(universityIds.size());
        for (String id : universityIds) {
            universityIdsParams.add("member=" + id);
        }
        String joinedIds = String.join("&", universityIdsParams);

        String endpoint = "memberProfiles?" + joinedIds;

        String fieldsParam = String.join(",", fields);
        Map<String, String> queryParams = new HashMap<>(1);
        queryParams.put("fields", fieldsParam);
        return externalUserTabulaRequestHandler.makeGetRequest(endpoint, queryParams, MultipleMembersResponse.class);
    }

    public ApiResponse<MultipleMembersResponse> getMultipleMembers(Set<String> universityIds) throws IOException {
        return getMultipleMembers(universityIds, Collections.emptySet());
    }
}
