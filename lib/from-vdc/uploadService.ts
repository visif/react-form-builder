import { ApiResponse, ApiService, HttpClient } from "./commonService";

// @ts-ignore
const uploadServlet: ApiService<any, {}> = async (payload: {}): Promise<ApiResponse<any, {}>> => {
  return await new HttpClient().formPost(
    "UploadServlet",
    payload
  );
};

export default {
  uploadServlet
};
