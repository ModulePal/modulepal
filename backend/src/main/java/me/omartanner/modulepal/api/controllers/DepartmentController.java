package me.omartanner.modulepal.api.controllers;

import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.api.dto.DepartmentBasicData;
import me.omartanner.modulepal.api.dto.DepartmentSearchData;
import me.omartanner.modulepal.api.dto.DepartmentSearchQuery;
import me.omartanner.modulepal.api.firebaseauth.FirebaseIdTokenChecker;
import me.omartanner.modulepal.api.responses.Response;
import me.omartanner.modulepal.api.responses.body.department.DepartmentBasicDataResponseBody;
import me.omartanner.modulepal.api.responses.body.department.DepartmentSearchResponseBody;
import me.omartanner.modulepal.api.responses.error.DataNotExistsResponse;
import me.omartanner.modulepal.api.responses.error.InvalidQueryResponse;
import me.omartanner.modulepal.data.h2.H2Manager;
import me.omartanner.modulepal.data.h2.model.Department;
import me.omartanner.modulepal.helper.error.ErrorLogging;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="/api/department")
@CrossOrigin(origins = {"*"}) // ADD YOUR OWN ORIGINS IF CORS REQUIRED
@Validated
@Slf4j
public class DepartmentController {
    @Autowired
    private FirebaseIdTokenChecker firebaseIdTokenChecker;

    @Autowired
    private H2Manager h2Manager;

    @GetMapping("/getBasicData")
    public Response<DepartmentBasicDataResponseBody> endpointGetBasicData(
//            @RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestParam(name="departmentCode") @NotNull String departmentCode
    )
    {
        // check id token to see if user e and has a verified e
//        FirebaseIdTokenChecker.Result<DepartmentBasicDataResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
//        if (!checkIdTokenResult.validUser()) {
//            return checkIdTokenResult.getErrorResponse();
//        }

        Optional<Department> departmentOptional = h2Manager.getDepartment(departmentCode);
        if (departmentOptional.isPresent()) {
            return new Response<>(true, null, new DepartmentBasicDataResponseBody(new DepartmentBasicData(departmentOptional.get())));
        }
        Response<DepartmentBasicDataResponseBody> r = new DataNotExistsResponse<>();
        ErrorLogging.logApiError("/api/department/getBasicData", "departmentCode: " + departmentCode, r.getError(), null);
        return r;
    }

    @PostMapping("/search")
    public Response<DepartmentSearchResponseBody> endpointSearch(
//            @RequestParam(name="firebaseTokenId") @NotNull String firebaseTokenId,
            @RequestBody @NotNull DepartmentSearchQuery departmentSearchQuery
    )
    {
        // check id token to see if user e and has a verified e
//        FirebaseIdTokenChecker.Result<DepartmentSearchResponseBody> checkIdTokenResult = firebaseIdTokenChecker.checkIdToken(firebaseTokenId);
//        if (!checkIdTokenResult.validUser()) {
//            return checkIdTokenResult.getErrorResponse();
//        }
        String context = "departmentSearchQuery: " + departmentSearchQuery.toString();

        if (!departmentSearchQuery.valid()) {
            Response<DepartmentSearchResponseBody> r = new InvalidQueryResponse<>();
            ErrorLogging.logApiError("/api/department/search", context, r.getError(), null);
            return r;
        }

        Pageable pageable = departmentSearchQuery.getPageable();

        List<Department> departments;

        boolean haveDepartmentCode = departmentSearchQuery.getDepartmentCode() != null;
        boolean haveDepartmentName = departmentSearchQuery.getDepartmentName() != null;

        if (haveDepartmentCode && haveDepartmentName) {
            departments = h2Manager.searchDepartmentsByNameOrCode(departmentSearchQuery.getDepartmentName(), departmentSearchQuery.getDepartmentCode(), pageable);
        }
        else {
            if (haveDepartmentCode) {
                departments = h2Manager.searchDepartmentsByCode(departmentSearchQuery.getDepartmentCode(), pageable);
            }
            else {
                departments = h2Manager.searchDepartmentsByName(departmentSearchQuery.getDepartmentName(), pageable);
            }
        }

        List<DepartmentSearchData> departmentsResult = new ArrayList<>();
        for (Department department : departments) {
            departmentsResult.add(new DepartmentSearchData(department));
        }
        DepartmentSearchResponseBody departmentSearchResponseBody = new DepartmentSearchResponseBody(departmentsResult);
        return new Response<>(true, null, departmentSearchResponseBody);
    }
}
