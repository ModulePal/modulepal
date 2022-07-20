package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingAddBody {
    private String removeRatingId;
    private List<RatingAddData> newRatings;
    private String moduleCode;

    public boolean valid() {
        if (newRatings == null || moduleCode == null) {
            return false;
        }
        // check for duplicate rating type & acacemic years (since can't have two ratings for same rating type & academic year)
        Set<RatingAddData> ratingAddDataSet = new HashSet<>(newRatings);
        if (ratingAddDataSet.size() != newRatings.size()) {
            return false;
        }

        // check each RatingAddData itself is valid
        for (RatingAddData ratingAddData : newRatings) {
            if (!ratingAddData.valid()) {
                return false;
            }
        }
        return true;
    }

    public boolean verifyLegalAcademicYears(Set<String> academicYearsDoneModule) {
        for (RatingAddData newRating: newRatings) {
            if (!academicYearsDoneModule.contains(newRating.getAcademicYear())) {
                return false;
            }
        }
        return true;
    }
}
