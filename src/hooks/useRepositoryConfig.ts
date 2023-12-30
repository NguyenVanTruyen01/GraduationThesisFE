import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from 'axios';
import useStorage from './useStorage';
const axiosClient = axios.create({
  baseURL: 'https://nodejsclusters-158883-0.cloudclusters.net/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
const Repository = (type: string, url: string, payload?: any) => {
  const { params, body } = payload;

  switch (type) {
    case 'GET':
      return axiosClient.get(url, { params: params ? params : {} });
    case 'POST':
      return axiosClient.post(url, body);
    case 'PUT':
      return axiosClient.put(url, body);
    case 'PATCH':
      return axiosClient.patch(url, body);
    case 'DELETE':
      return axiosClient.delete(url, { params: params });
  }
};
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config: any) {
    const token = useStorage.GetLocalStorage('token');
    const headers: any = {
      Authorization: token?.replaceAll('"', ""),
    }; scrollY
    if (token) config.headers = { ...config.headers, ...headers };

    // Do something before request is sent
    return config;
  },
  function (error: any) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error: any) {

    console.log("error:" + error)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default Repository;
