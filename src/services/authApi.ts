import { BASE_API_URL } from "@/utils/globalVariables";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    credentials: 'include',
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as RootState).auth.token;
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    // Generic type theo thứ tự là kiểu response trả về và argument
    loginUser: builder.mutation({
      query: (body: { email: string; password: string }) => {
        return { url: '/users/login', method: 'post', body };
      },
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
