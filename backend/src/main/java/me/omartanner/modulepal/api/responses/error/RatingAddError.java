package me.omartanner.modulepal.api.responses.error;

public enum RatingAddError {
    RATING_ALREADY_EXISTS {
        @Override
        public int id() {
            return 60;
        }
    },
    FAILED_TO_WRITE_TO_FIREBASE {
        @Override
        public int id() {
            return 61;
        }
    },
    FAILED_TO_WRITE_TO_H2 {
        @Override
        public int id() {
            return 62;
        }
    },
    FAILED_TO_OBTAIN_USER_MODULE_REGISTRATIONS {
        @Override
        public int id() {
            return 63;
        }
    },
    NO_MODULE_REGISTRATION_EXISTS {
        @Override
        public int id() {
            return 64;
        }
    },
    ILLEGAL_ACADEMIC_YEARS {
        @Override
        public int id() {
            return 65;
        }
    };

    public abstract int id();
}
