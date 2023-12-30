import axios from "axios";
import { BASE_API_URL } from "./globalVariables";

export const api = axios.create({
  baseURL: BASE_API_URL,
});