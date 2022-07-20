package me.omartanner.modulepal.data.ratingtype;

import java.util.HashSet;
import java.util.Set;

public enum RatingType {
    COMMENT {
        @Override
        public int maxValue() {
            return 0;
        }

        @Override
        public boolean isTextual() {
            return true;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    DIFFICULTY {
        @Override
        public int maxValue() {
            return 5;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    CONTENT {
        @Override
        public int maxValue() {
            return 5;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    COURSEWORK_LOAD {
        @Override
        public int maxValue() {
            return 3;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    EXAM_DIFFICULTY {
        @Override
        public int maxValue() {
            return 3;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    CONTENT_LOAD {
        @Override
        public int maxValue() {
            return 3;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    SUPPORT {
        @Override
        public int maxValue() {
            return 3;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    LECTURES {
        @Override
        public int maxValue() {
            return 5;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    LECTURE_SPEED {
        @Override
        public int maxValue() {
            return 3;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    FEEDBACK {
        @Override
        public int maxValue() {
            return 5;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    RESOURCES {
        @Override
        public int maxValue() {
            return 3;
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    SUGGESTION { // handled in the same way as comment
        @Override
        public int maxValue() {
            return 0;
        }

        @Override
        public boolean isTextual() {
            return true;
        }

        @Override
        public boolean isRecursive() {
            return false;
        }
    },
    LIKE { // 12 - note manual reference to 12 in native query for updating department & module rankings
        @Override
        public int maxValue() {
            return 2; // 1 for like, 2 for dislike
        }

        @Override
        public boolean isTextual() {
            return false;
        }

        @Override
        public boolean isRecursive() {
            return true;
        }
    };

    public static int max() {
        return values().length - 1;
    }

    public static RatingType fromId(int id) {
        if (id > max()) return null;
        return values()[id];
    }

    public int id() {
        return ordinal();
    }

    public abstract int maxValue();

    public static Set<RatingType> all() {
        Set<RatingType> result = new HashSet<>();
        result.add(COMMENT);
        result.add(DIFFICULTY);
        result.add(CONTENT);
        result.add(COURSEWORK_LOAD);
        result.add(EXAM_DIFFICULTY);
        result.add(CONTENT_LOAD);
        result.add(SUPPORT);
        result.add(LECTURES);
        result.add(LECTURE_SPEED);
        result.add(FEEDBACK);
        result.add(RESOURCES);
        result.add(SUGGESTION);
        return result;
    }

    public abstract boolean isTextual();

    public abstract boolean isRecursive(); // if it's a rating of a rating, e.g. a like which is rating how agreeable a rating is
}
