// import { ILogin, IRegister } from '../types/interface';
import Repository from '@/hooks/useRepositoryConfig';
import axios from 'axios';

// import { DomainServer } from "constant/Constant"
// const url=DomainServer+'/api/v1/auth'
const url = 'https://graduation-thesis-be.onrender.com';

const AuthServices = {
  // postUserLogin: async (user: ILogin) => {
  //   return await axios.post(`${url}/users/login`, user, {
  //     headers: { 'Access-Control-Allow-Origin': '*' },
  //   });
  // },
  // postUserRegister: async (user: IRegister) => {
  //   console.log(url);
  //   return await axios.post(`${url}/register`, user, {
  //     headers: { 'Access-Control-Allow-Origin': '*' },
  //   });
  // },
  ResetPassword: async (
    password: string,
    oldPassword: string,
    email: string,
    token: string
  ) => {
    return await axios.post(
      `${url}/reset-password`,
      { password, oldPassword, email },
      {
        headers: { Authorization: token },
      }
    );
  },
  ForgotPassword: async (email: string) => {
    return await axios.post(`${url}/forgot-password`, { email });
  },
  logout: async () => {
    return await axios.post(`${url}/logout`);
  },
  getAllStudent: async () => {
    return await axios.get(`${url}/student`);
  },
  getAllAccount: async (page: number) => {
    return await axios.get(`${url}/account?page=${page}`);
  },
  getAllStudentNoGroup: async () => {
    return await axios.get(`${url}/student/no-group`);
  },
  getAllTeacher: async () => {
    return await axios.get(`${url}/teacher`);
  },
  getTotalAccount: async () => {
    return await Repository('GET', url + '/total', { params: {}, payload: {} });
  },
  updateInfoAccount: async (data: any) => {
    return await Repository('POST', url + '/update-profile', {
      params: {},
      body: data,
    });
  },
};
export default AuthServices;
