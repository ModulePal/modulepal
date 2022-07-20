package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.academicyear.AcademicYearParser;
import me.omartanner.modulepal.data.grade.Grade;
import me.omartanner.modulepal.data.ratingtype.RatingType;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModuleRatingsQuery {
    private String moduleCode;
    private List<Grade> grades; // if null get all
    private List<String> academicYears; // e.g 19-20, 20-21, etc.. if null get all
    private List<RatingType> ratingTypes; // if null get all
    private Boolean onlyMyRatings;

    public boolean valid() {
        if (moduleCode == null || onlyMyRatings == null) return false;

        // we cannot have onlyMyRatings false for aggregates or likes (comments/suggestions it's fine) - security!!!!
        // we check for aggregates or likes by looking for any rating type that isn't textual
        if (!onlyMyRatings && (ratingTypes == null || ratingTypes.stream().anyMatch(ratingType -> !ratingType.isTextual()))) {
            return false;
        }

        // check no duplicates in grades, academicYears and ratingTypes
        if (grades != null) {
            Set<Grade> gradesSet = new HashSet<>(grades);
            if (gradesSet.size() < grades.size()) {
                return false;
            }
        }
        if (academicYears != null) {
            Set<String> academicYearsSet = new HashSet<>(academicYears);
            if (academicYearsSet.size() < academicYears.size()) {
                return false;
            }
            for (String academicYear : academicYears) {
                if (!AcademicYearParser.validAcademicYear(academicYear)) {
                    return false;
                }
            }
        }
        if (ratingTypes != null) {
            Set<RatingType> ratingTypesSet = new HashSet<>(ratingTypes);
            if (ratingTypesSet.size() < ratingTypes.size()) {
                return false;
            }
        }

        return true;
    }
}
