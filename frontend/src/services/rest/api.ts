import { makeGetRequest, makePostRequest } from "./rest";
import { ModuleSearchResponse } from "./responses/ModuleSearchResponse";
import { ModuleSearchQuery } from "./dto/ModuleSearchQuery";
import { ModuleSearchResponseBody } from "./responses/body/ModuleSearchResponseBody";
import { ApiResponse } from "./ApiResponse";
import { DepartmentSearchQuery } from "./dto/DepartmentSearchQuery";
import { DepartmentSearchResponseBody } from "./responses/body/DepartmentSearchResponseBody";
import { UserPrimaryUniUserBasicDataResponseBody } from "./responses/body/UserPrimaryUniUserBasicDataResponseBody";
import { AuthBeginResponseBody } from "./responses/body/AuthBeginResponseBody";
import { AuthAuthorisedResponseBody } from "./responses/body/AuthAuthorisedResponseBody";
import { ModuleBasicDataResponseBody } from "./responses/body/ModuleBasicDataResponseBody";
import { ModuleRatingAggregateGetResponseBody } from "./responses/body/ModuleRatingAggregateGetResponseBody";
import { ModuleRatingAggregatesQuery } from "./dto/ModuleRatingAggregatesQuery";
import { ModuleRatingAcademicYearRangeResponseBody } from "./responses/body/ModuleRatingAcademicYearRangeResponseBody";
import { ModuleRatingsQuery } from "./dto/ModuleRatingsQuery";
import { ModuleRatingGetResponseBody } from "./responses/body/ModuleRatingGetResponseBody";
import { RatingAddBody } from "./dto/RatingAddBody";
import { ModuleRatingAddResponseBody } from "./responses/body/ModuleRatingAddResponseBody";
import { ModuleRatingRemoveResponseBody } from "./responses/body/ModuleRatingRemoveResponseBody";
import { GetPrimaryUniUserModuleRegistrationsResponseBody } from "./responses/body/GetPrimaryUniUserModuleRegistrationsResponseBody";
import { AuthRevokeAccessTokensAndObtainNewResponseBody } from "./responses/body/AuthRevokeAccessTokensAndObtainNewResponseBody";
import { UserGetAnonymousResponseBody } from "./responses/body/UserGetAnonymousResponseBody";
import { UserGetInvalidatedRatingsResponseBody } from "./responses/body/UserGetInvalidatedRatingsResponseBody"; 
import { getErrorResponse } from "./error";
import { updateIdToken } from "../firebase/AuthStore";
import { AuthUnlinkResponseBody } from "./responses/body/AuthUnlinkResponseBody";
import { UserAddToMailingListResponseBody } from "./responses/body/UserAddToMailingListResponseBody";
import { Consent } from "./dto/Consent";
import { AuthCheckResponseBody } from "./responses/body/AuthCheckResponseBody";
import { ModuleMetadataResponseBody } from "./responses/body/ModuleMetadataResponseBody";

export async function searchModules(
    // firebaseTokenId: string,
    moduleSearchQuery: ModuleSearchQuery,
    ): Promise<ApiResponse<ModuleSearchResponseBody>> {
    return makePostRequest(
        "/module/search",
        {
            // firebaseTokenId: firebaseTokenId
        },
        moduleSearchQuery
    );
}

export async function searchDepartments(
  // firebaseTokenId: string,
  departmentSearchQuery: DepartmentSearchQuery,
  ): Promise<ApiResponse<DepartmentSearchResponseBody>> {
  return makePostRequest(
      "/department/search",
      {
          // firebaseTokenId: firebaseTokenId
      },
      departmentSearchQuery
  );
}

export async function getUserPrimaryUniUserBasicData(
  firebaseTokenId: string
): Promise<ApiResponse<UserPrimaryUniUserBasicDataResponseBody>> {
  return makeGetRequest(
    "/user/uniUser/getPrimaryUniUserBasicData",
    {
      firebaseTokenId: firebaseTokenId
    }
  );
}

export async function authBegin(
  firebaseTokenId: string,
  newAccount: boolean
): Promise<ApiResponse<AuthBeginResponseBody>> {
  return makeGetRequest(
    "/auth/begin",
    {
      firebaseTokenId: firebaseTokenId,
      newAccount: newAccount
    }
  );
}

export async function authAuthorised(
  firebaseTokenId: string,
  oAuthToken: string,
  verifier: string | null,
  newAccount: boolean,
  updateDataIfAlreadyExists: boolean,
  newConsent: Consent | null
): Promise<ApiResponse<AuthAuthorisedResponseBody>> {
    return makePostRequest(
      "/auth/authorised",
      {
        firebaseTokenId: firebaseTokenId,
        oAuthToken: oAuthToken,
        verifier: verifier,
        newAccount: newAccount,
        updateDataIfAlreadyExists: updateDataIfAlreadyExists
      },
      newConsent
    );
};

export async function authUnlink(
  firebaseTokenId: string
): Promise<ApiResponse<AuthUnlinkResponseBody>> {
  return makeGetRequest(
    "/auth/unlink",
    {
      firebaseTokenId: firebaseTokenId
    }
  );
}

// DEPRECATED
// export async function getModuleBasicData(
//   // firebaseTokenId: string,
//   moduleCode: string
// ): Promise<ApiResponse<ModuleBasicDataResponseBody>> {
//   return makeGetRequest(
//     "/module/getBasicData",
//     {
//       // firebaseTokenId: firebaseTokenId,
//       moduleCode: moduleCode
//     }
//   );
// }

export async function getModuleMetadata(
    moduleCode: string,
    includeBasicData: boolean,
    includeAcademicYears: boolean,
    includeLeaders: boolean,
    includeNumReviews: boolean
): Promise<ApiResponse<ModuleMetadataResponseBody>> {
  return makeGetRequest(
    "/module/getMetadata",
    {
      moduleCode: moduleCode,
      includeBasicData,
      includeAcademicYears,
      includeLeaders,
      includeNumReviews
    }
  );
}

export async function getModuleRatingAggregates(
  // firebaseTokenId: string,
  moduleCode: string,
  getModuleRatingAggregatesQuery: ModuleRatingAggregatesQuery | null
): Promise<ApiResponse<ModuleRatingAggregateGetResponseBody>> {
  return makePostRequest(
    "/module/rating/aggregate/get",
    {
      // firebaseTokenId: firebaseTokenId,
      moduleCode: moduleCode
    },
    getModuleRatingAggregatesQuery
  )
}

export async function getModuleAcademicYearRange(
  // firebaseTokenId: string,
  moduleCode: string
): Promise<ApiResponse<ModuleRatingAcademicYearRangeResponseBody>> {
  return makeGetRequest(
    "/module/rating/getAcademicYearRange",
    {
      // firebaseTokenId: firebaseTokenId,
      moduleCode: moduleCode
    }
  );
}

export async function getModuleRatings(
  firebaseTokenId: string | null,
  moduleRatingsQuery: ModuleRatingsQuery
): Promise<ApiResponse<ModuleRatingGetResponseBody>> {
  return makePostRequest(
    "/module/rating/get",
    {
      firebaseTokenId: firebaseTokenId
    },
    moduleRatingsQuery
  );
}

export async function addRating(
  firebaseTokenId: string,
  ratingAddBody: RatingAddBody
): Promise<ApiResponse<ModuleRatingAddResponseBody>> {
  return makePostRequest(
    "/module/rating/add",
    {
      firebaseTokenId: firebaseTokenId
    },
    ratingAddBody
  );
}

export async function removeRating(
  firebaseTokenId: string,
  ratingId: string
): Promise<ApiResponse<ModuleRatingRemoveResponseBody>> {
  return makePostRequest(
    "/module/rating/remove",
    {
      firebaseTokenId: firebaseTokenId,
      ratingId: ratingId
    },
    null
  );
}

export async function getPrimaryUniUserModuleRegistrations(
  firebaseTokenId: string,
  moduleCode: string | null
): Promise<ApiResponse<GetPrimaryUniUserModuleRegistrationsResponseBody>> {
  return makeGetRequest(
    "/user/uniUser/getPrimaryUniUserModuleRegistrations",
    {
      firebaseTokenId: firebaseTokenId,
      moduleCode: moduleCode
    }
  );
}

export async function revokeAllAccessTokensAndObtainNew(
  firebaseTokenId: string,
): Promise<ApiResponse<AuthRevokeAccessTokensAndObtainNewResponseBody>> {
  return makeGetRequest(
    "/auth/revokeAccessTokensAndObtainNew",
    {
      firebaseTokenId: firebaseTokenId
    }
  );
}

export async function userSetAnonymous(
  firebaseTokenId: string,
  anonymous: boolean
): Promise<ApiResponse<null>> {
  return makePostRequest(
    "/user/uniUser/anonymous/set",
    {
      firebaseTokenId: firebaseTokenId,
      anonymous: anonymous
    },
    null
  );
}

export async function userGetInvaliatedRatings(
  firebaseTokenId: string
): Promise<ApiResponse<UserGetInvalidatedRatingsResponseBody>> {
  return makeGetRequest(
    "/user/getInvalidatedRatings",
    {
      firebaseTokenId: firebaseTokenId
    }
  );
}

export async function userRemoveAllRatings(
  firebaseTokenId: string,
  onlyInvalidated: boolean
): Promise<ApiResponse<null>> {
  return makePostRequest(
    "/user/removeAllRatings",
    {
      firebaseTokenId: firebaseTokenId,
      onlyInvalidated: onlyInvalidated
    },
    null
  );
}

export async function userDelete(
  firebaseTokenId: string,
  deleteAllReviews: boolean
): Promise<ApiResponse<null>> {
  return makePostRequest(
    "/user/delete",
    {
      firebaseTokenId: firebaseTokenId,
      deleteAllReviews: deleteAllReviews
    },
    null
  );
}

// export async function voidExternalSessions(idToken: string): Promise<ApiResponse<AuthRevokeAccessTokensAndObtainNewResponseBody>> {
//   const response = await revokeAllAccessTokensAndObtainNew(idToken);
//   const errorResponse = getErrorResponse(response);
//   if (!errorResponse) {
//       const newIdToken = response.response!!.body.newTokenId;
//       updateIdToken(newIdToken);
//   }
//   return response;
// }

export async function userAddToMailingList(
  firebaseTokenId: string, 
  emailConsent: boolean
  ): Promise<ApiResponse<UserAddToMailingListResponseBody>> {
  return makePostRequest(
    "/user/addToMailingList",
    {
      firebaseTokenId: firebaseTokenId,
      emailConsent: emailConsent
    },
    null
  );
}

export async function authCheck(
  firebaseTokenId: string,
  oAuthToken: string,
  verifier: string
): Promise<ApiResponse<AuthCheckResponseBody>> {
  return makeGetRequest(
    "/auth/check",
    {
      firebaseTokenId: firebaseTokenId,
      oAuthToken: oAuthToken,
      verifier: verifier
    }
  );
}

export const GRADES = ["1st", "2.1", "2.2", "3rd", "Fail", "N/A"]
export const GRADE_INDEXES = {
    "I": 0,
    "IIi": 1,
    "IIii": 2,
    "III": 3,
    "F": 4,
    "U": 5
}

export const API_GRADES = ["I", "IIi", "IIii", "III", "F", "U"];

export const API_RATING_TYPES = [
  "DIFFICULTY",
  "CONTENT",
  "COURSEWORK_LOAD",
  "EXAM_DIFFICULTY",
  "CONTENT_LOAD",
  "SUPPORT",
  "LECTURES",
  "LECTURE_SPEED",
  "FEEDBACK",
  "RESOURCES"
];

export const API_RATING_TYPES_FRIENDLY_NAMES = {
  "DIFFICULTY": "Difficulty",
  "CONTENT": "Content",
  "COURSEWORK_LOAD": "Coursework Load",
  "EXAM_DIFFICULTY": "Exam Difficulty",
  "CONTENT_LOAD": "Content Load",
  "SUPPORT": "Support",
  "LECTURES": "Lectures",
  "LECTURE_SPEED": "Lecture Speed",
  "FEEDBACK": "Feedback",
  "RESOURCES": "Resources"
}

export const API_LIKE_VALUE = "1";
export const API_DISLIKE_VALUE = "2";

export const TEXTUAL_RATING_TYPES = ["COMMENT", "SUGGESTION"]