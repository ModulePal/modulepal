package me.omartanner.modulepal.helper.time;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeHelper {
    private static DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static LocalDateTime stringToDateTime(String str) {
        return LocalDateTime.parse(str, dateTimeFormatter);
    }

    public static String dateTimeToString(LocalDateTime dateTime) {
        return dateTime.format(dateTimeFormatter);
    }

    public static LocalDate stringToDate(String str) {
        return LocalDate.parse(str, dateFormatter);
    }

    public static String dateToString(LocalDate date) {
        return date.format(dateFormatter);
    }
}
