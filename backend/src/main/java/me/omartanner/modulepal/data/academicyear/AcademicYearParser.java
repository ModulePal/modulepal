package me.omartanner.modulepal.data.academicyear;

public class AcademicYearParser {
    public static boolean validAcademicYear(String academicYear) {
        if (academicYear == null) return false;
        if (academicYear.length() != 5) {
            return false;
        }
        char[] chars = academicYear.toCharArray();
        if (chars[2] != '/') {
            return false;
        }
        String lowerYearString = chars[0] + "" + chars[1];
        String higherYearString = chars[3] + "" + chars[4];
        try {
            int lowerYear = Integer.parseInt(lowerYearString);
            int higherYear = Integer.parseInt(higherYearString);
            if (higherYear != (lowerYear + 1)) {
                return false;
            }
        }
        catch (NumberFormatException e) {
            return false;
        }
        return true;
    }
}
