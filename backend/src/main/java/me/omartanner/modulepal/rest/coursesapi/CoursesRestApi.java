package me.omartanner.modulepal.rest.coursesapi;

import com.google.gson.reflect.TypeToken;
import me.omartanner.modulepal.rest.ApiResponse;
import me.omartanner.modulepal.rest.coursesapi.objects.ModuleFullData;
import me.omartanner.modulepal.rest.coursesapi.objects.ModuleMetadata;
import me.omartanner.modulepal.rest.coursesapi.response.ModulePageResponse;
import me.omartanner.modulepal.rest.tabulaapi.ExternalUserTabulaRequestHandler;
import me.omartanner.modulepal.rest.tabulaapi.response.AllDepartmentsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class CoursesRestApi {
    @Autowired
    private CoursesRequestHandler coursesRequestHandler;

    public ApiResponse<List<ModuleMetadata>> getModulePage(String page) throws IOException {
        Map<String, String> queryParams = new HashMap<>(1);
        queryParams.put("page", page);
        Type modulePageResponseType = new TypeToken<List<ModuleMetadata>>() {}.getType();
        return coursesRequestHandler.makeGetRequest("/modules", queryParams, modulePageResponseType);
    }

    public List<ModuleMetadata> getAllModulePages() throws IOException {
        boolean gotPage = true;
        int pageId = 0;
        List<ModuleMetadata> moduleMetadatas = new ArrayList<>();
        while (gotPage) {
            ApiResponse<List<ModuleMetadata>> modulePage;
            try {
                modulePage = getModulePage(String.valueOf(pageId++));
            }
            catch (Exception e) {
                gotPage = false;
                break;
            }
            if (modulePage.getCode() == 200 && modulePage.getBody() != null && modulePage.getBody().size() > 0) {
                moduleMetadatas.addAll(modulePage.getBody());
            }
            else {
                gotPage = false;
            }
        }
        return moduleMetadatas;
    }

    public List<ModuleFullData> getAllModulesFullData() throws IOException {
        List<ModuleMetadata> moduleMetadatas = getAllModulePages();
        return moduleMetadatas.parallelStream().map(moduleMetadata -> {
            try {
                ApiResponse<ModuleFullData> moduleFullData = getModuleFullData(moduleMetadata.getCode(), moduleMetadata.getAcademicYear());
                if (moduleFullData.getCode() == 200 && moduleFullData.getBody() != null) {
                    return moduleFullData.getBody();
                }
            }
            catch (Exception ignored) {
            }
            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());

    }

    public ApiResponse<ModuleFullData> getModuleFullData(String moduleCodeWithCats, String yearFourDigits) throws IOException {
        return coursesRequestHandler.makeGetRequest("/modules/" + yearFourDigits + "/" + moduleCodeWithCats, Collections.emptyMap(), ModuleFullData.class);
    }
}
