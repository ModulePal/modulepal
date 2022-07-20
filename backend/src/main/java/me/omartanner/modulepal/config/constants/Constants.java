package me.omartanner.modulepal.config.constants;

import me.omartanner.modulepal.helper.time.TimeHelper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class Constants {
    public static final LinkedList<String> TEST_DB_ROOT_REF = node("testDatabase");

    public static final LinkedList<String> DB_ROOT_REF = node("mainDatabase");

    public static final LinkedList<String> STATIC_DB_ROOT_REF = node("staticDatabase");

    private static LinkedList<String> node(String s) {
        LinkedList<String> l = new LinkedList<>();
        l.add(s);
        return l;
    }

    public static final List<LocalDateTime> FORCE_RERETRIEVE_WARWICK_STUDENT_DATA_DATES = Arrays.stream(
            new String[]{"2021-09-01", "2021-10-01", "2022-09-01", "2022-10-01", "2023-09-01", "2023-10-01"} // start of academic year for 2021, 2022 and 2023 (maybe add mid-way the academic year aswell?)
    ).map(TimeHelper::stringToDate).map(LocalDate::atStartOfDay).collect(Collectors.toList());


    public static final int FORCE_RERETRIEVE_WARWICK_STUDENT_DATA_NUM_DAYS = 7; // every week re-retrieve their student data


    public static final boolean PRODUCTION_CORS = false;
    public static final boolean STARTUP_PRODUCTION_DB = true;
    public static final boolean STARTUP_LOAD_DB = true;
    public static final boolean MAIL = true;

    public static final String[] CORS_ORIGIN = PRODUCTION_CORS ? new String[]{"https://modulepal.com", "https://stg.modulepal.com"} : new String[]{"*"};

    public static final String TABULA_API_HTTP_AUTH_HEADER_VALUE = System.getenv("TABULA_API_HTTP_AUTH_HEADER_VALUE");

    public static final String TABULA_API_VERSION_TAG = "v1";

//    public static final int BASIC_AUTH_COOLDOWN_MINS = 1;
//    public static final int NEW_ACCOUNT_ALREADY_AUTHENTICATED_AUTH_COOLDOWN_MINS = 1440;
//    public static final int UPDATE_UNI_DATA_ALREADY_AUTHENTICATED_DATA_IN_SYSTEM_AUTH_COOLDOW_MINS = 10080;
//    public static final int UPDATE_UNI_DATA_ALREADY_AUTHENTICATED_DATA_NOT_IN_SYSTEM_AUTH_COOLDOW_MINS = 0;

    public static final int AUTH_COOLDOWN_SECONDS = 5;
    public static final int UPDATE_UNI_DATA_ALREADY_AUTHENTICATED_DATA_IN_SYSTEM_AUTH_COOLDOWN_SECONDS = 5;
    public static final int UPDATE_UNI_DATA_ALREADY_AUTHENTICATED_DATA_NOT_IN_SYSTEM_AUTH_COOLDOWN_SECONDS = 5;

    public static  final int TEXTUAL_MAX_LENGTH = 255;
    public static final int TEXTUAL_MIN_LENGTH = 3;

    public static final boolean DEFAULT_ANONYMOUS_SETTING = true;

    // MAILCHIMP
    public static final String MAILCHIMP_API_KEY = System.getenv("MAILCHIMP_API_KEY");
    public static final String MAILCHIMP_LIST_ID = System.getenv("MAILCHIMP_LIST_ID");

    public static final int ANONYMOUS_ACCOUNT_DELETION_DAYS = 7;
}
