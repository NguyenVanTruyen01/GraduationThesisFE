import { ILoginPayload, IRegisterPayload } from "@/types/auth.type";
import { api } from "./axios";

export const getUserLogin = async (formData: ILoginPayload) => {
  try {
    // let data: IServerLogin = await api.post('/users/login', formData)
    const { data, status } = await api.post('/users/login', formData)
    return data 
  } catch (error:any) {
    console.log("vao dya:"+JSON.stringify(error?.response))
    if(error?.response !== null  && error?.response !== undefined)
    {
      return error?.response?.data
    }
    else{
      return null
    }
      
    }
};

export const signup = async (formData: IRegisterPayload) => {
  try {
    const response = await api.post('/register', formData);
    return response;
  } catch (error) {
    // console.log(error);
    return error;
  }
};