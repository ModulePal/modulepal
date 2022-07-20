package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Objects;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InvalidatedRatingBasicData {
    private String moduleCode;
    private String academicYear;
    private boolean invalidated;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InvalidatedRatingBasicData that = (InvalidatedRatingBasicData) o;
        return moduleCode.equals(that.moduleCode) &&
                academicYear.equals(that.academicYear);
    }

    @Override
    public int hashCode() {
        return Objects.hash(moduleCode, academicYear);
    }
}
