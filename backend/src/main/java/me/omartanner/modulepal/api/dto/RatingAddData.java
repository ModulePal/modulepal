package me.omartanner.modulepal.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import me.omartanner.modulepal.Constants;
import me.omartanner.modulepal.data.academicyear.AcademicYearParser;
import me.omartanner.modulepal.data.ratingtype.RatingType;

import java.util.Objects;

@Data
@AllArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingAddData {
    private RatingType type;
    private String value;
    private String academicYear;
    private String targetRatingId; // for likes

    /*
        NOTE THAT HASH EQUALITY IS DETERMINED BY: m, type, y.
        this is because if the combination of them is unique, then it's a unique rating.
        duplicate m, type and y means a duplicate rating which isn't allowed.
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RatingAddData that = (RatingAddData) o;
        return type == that.type &&
                academicYear.equals(that.academicYear);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, academicYear);
    }

    public boolean valid() {
        boolean nullCheck = type != null && value != null && academicYear != null;
        if (!nullCheck) return false;

        // check if it is a recursive rating type then the target is provided
        if (type.isRecursive() && targetRatingId == null) return false;

        /*
            we now parse the v based on type, and academic year based on academic year format
         */
        if (type.isTextual()) {
            // check comment or suggestion is valid, i.e length <= Constants.TEXTUAL_MAX_LENGTH chars
            if (value.length() > Constants.TEXTUAL_MAX_LENGTH || value.length() < Constants.TEXTUAL_MIN_LENGTH) {
                return false;
            }
        }
        else {
            // parse v into integer, check passes. then check is in bounds, i.e 1 to type.maxValue() inclusive
            int valueInt;
            try {
                valueInt = Integer.parseInt(value);
            }
            catch (NumberFormatException e) {
                return false;
            }
            if (valueInt < 1 || valueInt > type.maxValue()) {
                return false;
            }
        }
        if (!AcademicYearParser.validAcademicYear(academicYear)) {
            return false;
        }
        return true;
    }
}
