import has from "lodash-es/has";
import get from "lodash-es/get";
import querystring from "querystring";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource
} from "axios";
import { refreshScreen } from "./utilities";
import { getApiBaseUrl, getIdleTimeout } from "./configuration";
import { saveLoginSession } from "./loginContext";

export interface ApiResponse<T, E> {
  data?: T;
  error?: E;
}

export type ApiService<T, E> = (
  payload?: unknown
) => Promise<ApiResponse<T, E>> | never;

export const validateStatus = (status: number): boolean => {
  return status >= 200;
};

export type RequestParam = {
  [key: string]: string | number | boolean;
};

export class HttpClient {
  protected httpTimeout = getIdleTimeout();
  protected axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: getApiBaseUrl(),
      validateStatus,
      timeout: this.httpTimeout,
      withCredentials: true
    });
  }

  public async get<T, E>(
    path: string,
    params?: RequestParam,
    headers?: RequestParam
  ): Promise<ApiResponse<T, E>> | never {
    this.addHeaders(headers);

    const axiosCancelSource = axios.CancelToken.source();
    const timeoutId = this.setHttpTimeout(axiosCancelSource);

    try {
      const result = await this.axiosInstance.get<T | E>(path, {
        cancelToken: axiosCancelSource.token,
        params
      });
      return await this.handleGetResponse(result);
    } catch (e) {
      return this.handleAxiosError(e);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public async post<T, E>(
    path: string,
    payload: unknown,
    headers?: RequestParam
  ): Promise<ApiResponse<T, E>> | never {
    this.addHeaders(headers);
    const axiosCancelSource = axios.CancelToken.source();
    const timeoutId = this.setHttpTimeout(axiosCancelSource);
    try {
      const result = await this.axiosInstance.post<T | E>(path, payload, {
        cancelToken: axiosCancelSource.token
      });
      return await this.handlePostResponse(result);
    } catch (e) {
      return await this.handleAxiosError(e);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public async formPost<T, E>(
    path: string,
    payload: RequestParam,
    headers?: RequestParam
  ): Promise<ApiResponse<T, E>> | never {
    this.addHeaders(headers);
    const axiosCancelSource = axios.CancelToken.source();
    const timeoutId = this.setHttpTimeout(axiosCancelSource);
    try {
      const result = await this.axiosInstance.post<T | E>(
        path,
        querystring.stringify(payload),
        { cancelToken: axiosCancelSource.token, withCredentials: true }
      );
      return await this.handlePostResponse(result);
    } catch (e) {
      return await this.handleAxiosError(e);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private addHeaders(headers?: RequestParam): void {
    if (headers) {
      this.axiosInstance.interceptors.request.use(
        (reqConfig: AxiosRequestConfig) => {
          reqConfig.headers = {
            ...reqConfig.headers,
            ...headers
          };
          return reqConfig;
        }
      );
    }
  }

  private setHttpTimeout(cancelTokenSource: CancelTokenSource): NodeJS.Timeout {
    return setTimeout(() => {
      return cancelTokenSource.cancel(
        `HTTP timeout after ${this.httpTimeout}ms.`
      );
    }, this.httpTimeout);
  }

  private resolveSuccess<T, E>(responseData: T): Promise<ApiResponse<T, E>> {
    if (has(responseData, "data") && has(responseData, "error")) {
      return Promise.resolve({
        data: get(responseData, "data") as T,
        error: get(responseData, "error") as E
      });
    }
    return Promise.resolve({ data: responseData as T });
  }

  private async handlePostResponse<T, E>(
    response: AxiosResponse
  ): Promise<ApiResponse<T, E>> | never {
    const { status, data } = response;
    if (`${data}` === "011") {
      saveLoginSession(null);
      refreshScreen();
    }

    if (status === 200 || status === 204) {
      return this.resolveSuccess(response.data);
    }

    if (status === 403 || status === 400) {
      return Promise.reject({ error: response.data as E });
    }

    throw new Error("Something went wrong");
  }

  private async handleGetResponse<T, E>(
    response: AxiosResponse
  ): Promise<ApiResponse<T, E>> | never {
    const { status, data } = response;
    if (`${data}` === "011") {
      saveLoginSession(null);
      refreshScreen();
    }
    if (status === 200) {
      return this.resolveSuccess(response.data);
    }

    throw new Error("Something went wrong");
  }

  public async handleAxiosError(e: AxiosError): Promise<never> {
    if (axios.isCancel(e) || e.code === "ECONNABORTED") {
      throw new Error(e.message);
    }
    throw e;
  }
}
