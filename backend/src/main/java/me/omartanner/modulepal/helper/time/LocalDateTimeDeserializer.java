package me.omartanner.modulepal.helper.time;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

public class LocalDateTimeDeserializer implements JsonDeserializer<LocalDateTime> {
    @Override
    public LocalDateTime deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        String dateTimeString = jsonElement.getAsJsonPrimitive().getAsString();
        try {
            return TimeHelper.stringToDateTime(dateTimeString);
        }
        catch (DateTimeParseException e) {
            throw new JsonParseException(e);
        }
    }
}
