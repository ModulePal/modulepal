package me.omartanner.modulepal.helper.json;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import me.omartanner.modulepal.helper.time.LocalDateDeserializer;
import me.omartanner.modulepal.helper.time.LocalDateSerializer;
import me.omartanner.modulepal.helper.time.LocalDateTimeDeserializer;
import me.omartanner.modulepal.helper.time.LocalDateTimeSerializer;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Deserializer {
    public static final Gson GSON;
    static {
        GSON = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDate.class, new LocalDateSerializer())
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer())
                .registerTypeAdapter(LocalDate.class, new LocalDateDeserializer())
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeDeserializer())
                .create();
    }

    public static <T> T deserialize(String json, Class<T> clazz) {
        return GSON.fromJson(json, clazz);
    }

    public static <T> T deserialize(String json, Type type) {
        return GSON.fromJson(json, type);
    }

    public static <T> T deserialize(Object json, Class<T> clazz) {
        return GSON.fromJson(GSON.toJson(json), clazz);
    }


}
