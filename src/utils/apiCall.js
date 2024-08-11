import axios from "axios";
import { GET_ALL_NOTES, LOGIN, REGISTER } from "./endPoints";

// Create an Axios instance with default settings
const API = axios.create({
  baseURL: "/",
  timeout: 10 * 1000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const getToken = () => localStorage.getItem("noteToken");

export const getNotesApi = async (route, query = "") => {
  const token = getToken();
  return API.get(`${GET_ALL_NOTES}/${route}?${query}`, {
    headers: {
      Authorization: token || "",
    },
  });
};

export const registerApi = async (data) => {
  const token = getToken();
  return API.post(`${REGISTER}`, data, {
    headers: {
      Authorization: token || "",
    },
  });
};

export const loginApi = async (data) => {
  const token = getToken();
  return API.post(`${LOGIN}`, data, {
    headers: {
      Authorization: token || "",
    },
  });
};
