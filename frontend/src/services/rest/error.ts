import { ApiResponse } from "./ApiResponse";
import { number } from "prop-types";

export enum ErrorTypeApiResponse {
    REQUEST_ERROR,
    NULL_RESPONSE,
    API_ERROR_CODE,
    API_UNSUCCESSFUL_RESPONSE
  }

const noCodeErrorMessage = "Unknown error occured. If this error persists, please report it.";

const errorMessages: Record<number, string> = {
    1: "Invalid session token. Please refresh, and if the issue persists report Error ID 1.",
    2: "You cannot do that as you have not verified your email. If this is a mistake, please report Error ID 2.",
    4: "Some data related to this action no longer exists. Plese refresh and try again, and if the issue persists please report Error ID 4.",
    8: "You are not authorised to do that. If this is a mistake, please report Error ID 8.",
    22: "You're doing that too often. If you have recently successfully linked your student account or updated your student data, please wait a day before updating again. Otherwise, please wait one minute before trying again. If the issue persists, please report Error ID 22.",
    23: "You cannot update your university data since you do not have an authenticated university account! If this is a mistake, please report Error ID 23.",
    31: "We could not obtain your university student data. Make sure to press 'Grant access' on the Warwick login page, and if the issue persists please report Error ID 31.",
    35: "You cannot change your university ID, or somebody else is already linked to this university ID. If you would like to change to change your university ID, please unlink your university account first. If this is a mistake, please report Error ID 35.",
    38: "You cannot update your university student data with another university account. Please try again with the university account linked to this account. If this is a mistake, please report Error ID 38.",
    39: "We do not have your consent to perform this action. Please accept the Terms and Conditions and Privacy policy and try again, and if not possible or the issue persists please report Error ID 64.",
    41: "Your university account does not seem to belong to a department. Please link an account that has a home department, and if the issue persists please report Error ID 41.",
    60: "That rating already exists. If this is a mistake, please report Error ID 61.",
    64: "You're not permitted to add this rating, since you have not done this module in the given academic year. If this is mistake, please update your student data, and if the issue persists please report Error ID 64."
  };

export const NOT_AUTHORISED_MESSAGE = errorMessages[8];

export interface ApiError {
    code: number | null,
    friendlyErrorMessage: string,
    decoratedFriendlyErrorMessage: string
}

export interface ErrorApiResponse {
    type: ErrorTypeApiResponse,
    info: ApiError
}

function getErrorMessage(errorCode: number): string {
    var result = errorMessages[errorCode];
    if (!result) {
        result = "An internal error occured with Error ID " + errorCode + ". Please refresh and try again, and if this error persists, please report Error ID " + errorCode + ".";
    }
    return result;
}
 
function getDecoratedFriendlyErrorMessage(errorCode: number): string {
    return "Oops! " + getErrorMessage(errorCode);
}

function getErrorCodeInfo(errorCode: number): ApiError {
    const errorMsg = getErrorMessage(errorCode);
    const decoratedErrorMessage = getDecoratedFriendlyErrorMessage(errorCode);
    return {
        code: errorCode,
        friendlyErrorMessage: errorMsg,
        decoratedFriendlyErrorMessage: decoratedErrorMessage
    };
}

  export function getErrorResponse<T>(apiResponse: ApiResponse<T>): ErrorApiResponse | null {
    if (!apiResponse) {
      return {
        type: ErrorTypeApiResponse.NULL_RESPONSE,
        info: {
          code: null,
          friendlyErrorMessage: "Empty response. Please refresh and try again, and if the issue persists please report Error ID C-N1.",
          decoratedFriendlyErrorMessage: "Uh oh! Empty response. Please refresh and try again, and if the issue persists please report Error ID C-N1."
        }
      }
    }
    if (!!apiResponse.error) {
        const code = apiResponse.error;
        const errorMsg = "Response Code " + code + ". Please refresh and try again, and if the issue persists please report this instance noting \"Response Code " + code + "\".";
        const decoratedErrorMsg = "Uh oh! " + errorMsg;
      return {
        type: ErrorTypeApiResponse.REQUEST_ERROR,
        info: {
          code: code,
          friendlyErrorMessage: errorMsg,
          decoratedFriendlyErrorMessage: decoratedErrorMsg
        }
      }
    }
    if (!!apiResponse.response) {
      const response = apiResponse.response;
      if (!!response.error) {
        return {
          type: ErrorTypeApiResponse.API_ERROR_CODE,
          info: getErrorCodeInfo(response.error)
        }
      }
      if (!response.success) {
        return {
          type: ErrorTypeApiResponse.API_UNSUCCESSFUL_RESPONSE,
          info: {
            code: null,
            friendlyErrorMessage: "Unsuccessful response. Please refresh and try again, and if the issue persists please report Error ID C-U.",
            decoratedFriendlyErrorMessage: "Uh oh! Unsuccessful response. Please refresh and try again, and if the issue persists please report Error ID C-U."
          }
        }
      }
      return null;
    }
    return {
      type: ErrorTypeApiResponse.NULL_RESPONSE,
      info: {
        code: null,
        friendlyErrorMessage: "Empty response. Please refresh and try again, and if the issue persists please report Error ID C-N2.",
        decoratedFriendlyErrorMessage: "Uh oh! Empty response. Please refresh and try again, and if the issue persists please report Error ID C-N2."
      }
    }
  }