import axios, { AxiosResponse } from 'axios';

import firebaseApp from "../firebase/firebase";
import { User } from "firebase";
import { Response } from './responses/Response';
import { ApiResponse } from './ApiResponse';

export var inProduction: boolean = false;

export var baseUrl = "ENTER THE BASE URL OF YOUR BACKEND'S API HERE";
export var frontendBaseUrl = "ENTER THE BASE URL OF YOUR FRONTEND HERE";

var root = baseUrl + "/api";

let config = {
    headers: {
        'Access-Control-Allow-Credentials': true
    }
  }

export async function makeGetRequest<T>(endpoint: string, paramData): Promise<ApiResponse<T>> {
    try {
        const res = await axios.get(root + endpoint, {
            params: paramData, withCredentials: false, headers: config
        });
        if (res.status === 200) {
            return {
                response: res.data,
                error: null
            }
        }
        else {
            return {
                response: res.data,
                error: res.status
            };
        }
    }
    catch (error) {
        return {
            response: null,
            error: error
        }
    }
}

export function makePostRequestAsync(endpoint: string, paramData, requestBodyData, handler200: ((body) => void), handlerNon200: ((errorId: number) => void), handlerFail: ((reason: String) => void)) {
    axios.post(root + endpoint, requestBodyData, {
        params: paramData, withCredentials: false, headers: config
    })
        .then(response => {
            if (response.status === 200) {
                handler200(response.data.body);
            }
            else {
                handlerNon200(response.data.error);
            }
        })
        .catch(reason => handlerFail(reason));
}

export async function makePostRequest<T>(endpoint: string, paramData, requestBodyData): Promise<ApiResponse<T>> {
    var response: ApiResponse<T> = {
        response: null,
        error: "Neither the then or catch blocks were entered!"
    };
    try {
        const res = await axios.post(root + endpoint, requestBodyData, {
            params: paramData, withCredentials: false, headers: config
        });
        if (res.status === 200) {
            return {
                response: res.data,
                error: null
            }
        }
        else {
            return {
                response: res.data,
                error: res.status
            };
        }
    }
    catch (error) {
        return {
            response: null,
            error: error
        }
    }
}