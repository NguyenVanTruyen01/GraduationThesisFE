// api.ts
import { BASE_API_URL } from "@/utils/globalVariables";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 10000, // Timeout sau 10 giây
});

interface ApiResponse<T = any> {
  data: T;
}

const handleRequest = async <T = any>(
  method: string,
  url: string,
  data: any = null,
  headers: Record<string, string> = {}
): Promise<T> => {
  const config: AxiosRequestConfig = {
    method: method,
    url: url,
    data: data,
    headers: headers,
  };

  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance(config);
    return response.data.data;
  } catch (error) {
    // Xử lý lỗi, có thể log hoặc throw lại
    console.error('Axios request error:', error);
    throw error;
  }
};

const api = {
  get: <T = any>(url: string, headers: Record<string, string> = {}): Promise<T> =>
    handleRequest('GET', url, null, headers),
  post: <T = any>(
    url: string,
    data: any,
    headers: Record<string, string> = {}
  ): Promise<T> => handleRequest('POST', url, data, headers),
  put: <T = any>(
    url: string,
    data: any,
    headers: Record<string, string> = {}
  ): Promise<T> => handleRequest('PUT', url, data, headers),
  patch: <T = any>(
    url: string,
    data: any,
    headers: Record<string, string> = {}
  ): Promise<T> => handleRequest('PATCH', url, data, headers),
};

export default api;
