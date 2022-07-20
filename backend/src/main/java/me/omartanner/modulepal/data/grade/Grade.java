package me.omartanner.modulepal.data.grade;

import java.util.HashSet;
import java.util.Set;

public enum Grade {
    I,
    IIi,
    IIii,
    III,
    F,
    U;

    private static HashSet<String> unknownTabulaGrades = new HashSet<>();
    static {
        unknownTabulaGrades.add("FM");
    }

    public static Grade fromMark(float mark) {
        if (mark >= 70.0f) {
            return I;
        }
        if (mark >= 60.0f) {
            return IIi;
        }
        if (mark >= 50.0f) {
            return IIii;
        }
        if (mark >= 40.0f) {
            return III;
        }
        if (mark >= 0.0f) {
            return F;
        }
        return null;
    }

    public static int max() {
        return values().length - 1;
    }

    public static Grade fromId(int id) {
        if (id > max()) return null;
        return values()[id];
    }

    public int id() {
        return ordinal();
    }

    public static Set<Grade> all() {
        Set<Grade> result = new HashSet<>();
        result.add(I);
        result.add(IIi);
        result.add(IIii);
        result.add(III);
        result.add(F);
        result.add(U);
        return result;
    }

    public static boolean isUnknown(String tabulaGradeString) {
        return unknownTabulaGrades.contains(tabulaGradeString);
    }
}
