package me.omartanner.modulepal.api.responses.body.module;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ModuleRatingAcademicYearRangeResponseBody {
    private List<String> academicYears;
}
