package me.omartanner.modulepal.helper.base64;

import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Base64 {
    public static String encode(String src) {
        return new String(java.util.Base64.getEncoder().encode(src.getBytes()));
    }

    public static String decode(String src) {
        return new String(java.util.Base64.getDecoder().decode(src.getBytes()));
    }

    public static <T extends Decodable> Map<String, T> decodeStringMap(Map<String, T> src, boolean decodeKeys) {
        Map<String, T> newMap = new HashMap<>(src.size());
        for (Map.Entry<String, T> mapEntry : src.entrySet()) {
            String decodedKey = decodeKeys ? decode(mapEntry.getKey()) : mapEntry.getKey();
            T value = mapEntry.getValue();
            value.decode();
            newMap.put(decodedKey, value);
        }
        return newMap;
    }

    public static Map<String, String> decodeStringStringMap(Map<String, String> src, boolean decodeKeys, boolean decodeValues) {
        Map<String, String> newMap = new HashMap<>(src.size());
        for (Map.Entry<String, String> mapEntry : src.entrySet()) {
            String decodedKey = decodeKeys ? decode(mapEntry.getKey()) : mapEntry.getKey();
            String decodedValue = decodeValues ? decode(mapEntry.getValue()) : mapEntry.getValue();
            newMap.put(decodedKey, decodedValue);
        }
        return newMap;
    }

    public static Map<String, List<String>> decodeStringListStringMap(Map<String, List<String>> src, boolean decodeKeys, boolean decodeValues) {
        Map<String, List<String>> newMap = new HashMap<>(src.size());
        for (Map.Entry<String, List<String>> mapEntry : src.entrySet()) {
            String decodedKey = decodeKeys ? decode(mapEntry.getKey()) : mapEntry.getKey();
            List<String> decodedList = mapEntry.getValue();
            if (decodeValues) decodeStringList(decodedList);
            newMap.put(decodedKey, decodedList);
        }
        return newMap;
    }

    public static Map<String, List<String>> encodeStringListStringMap(Map<String, List<String>> src, boolean encodeKeys, boolean encodeValues) {
        Map<String, List<String>> newMap = new HashMap<>(src.size());
        for (Map.Entry<String, List<String>> mapEntry : src.entrySet()) {
            String encodedKey = encodeKeys ? encode(mapEntry.getKey()) : mapEntry.getKey();
            List<String> encodedList = mapEntry.getValue();
            if (encodeValues) encodeStringList(encodedList);
            newMap.put(encodedKey, encodedList);
        }
        return newMap;
    }

    public static <T extends Encodable> Map<String, T> encodeStringMap(Map<String, T> src, boolean encodeKeys) {
        Map<String, T> newMap = new HashMap<>(src.size());
        for (Map.Entry<String, T> mapEntry : src.entrySet()) {
            String encodedKey = encodeKeys ? encode(mapEntry.getKey()) : mapEntry.getKey();
            T value = mapEntry.getValue();
            value.encode();
            newMap.put(encodedKey, value);
        }
        return newMap;
    }

    public static Map<String, String> encodeStringStringMap(Map<String, String> src, boolean encodeKeys, boolean encodeValues) {
        Map<String, String> newMap = new HashMap<>(src.size());
        for (Map.Entry<String, String> mapEntry : src.entrySet()) {
            String encodedKey = encodeKeys ? encode(mapEntry.getKey()) : mapEntry.getKey();
            String encodedValue = encodeValues ? encode(mapEntry.getValue()) : mapEntry.getValue();
            newMap.put(encodedKey, encodedValue);
        }
        return newMap;
    }

    public static <T extends Decodable> void decodeList(List<T> src) {
        for (T o : src) {
            o.decode();
        }
    }

    public static void decodeStringList(List<String> src) {
        for (int i = 0; i < src.size(); i++) {
            String s = src.get(i);
            String decoded = decode(s);
            src.set(i, decoded);
        }
    }

    public static void encodeStringList(List<String> src) {
        for (int i = 0; i < src.size(); i++) {
            String s = src.get(i);
            String encoded = encode(s);
            src.set(i, encoded);
        }
    }

    public static <T extends Encodable> void encodeList(List<T> src) {
        for (T o : src) {
            o.encode();
        }
    }
}
