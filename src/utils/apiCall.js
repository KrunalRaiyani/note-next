import axios from "axios";
import { GET_ALL_NOTES } from "./endPoints";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
};

const token = localStorage.getItem("noteToken");

if (token) {
  headers.Authorization = token;
}

const API = axios.create({
  baseURL: "/",
  // baseURL: process.env.NEXT_PUBLIC_API,
  timeout: 10 * 1000,
  headers,
});

export const getNotesApi = async (route, query = "") =>
  API.get(`${GET_ALL_NOTES}/${route}?${query}`);

//   export const postTwowheelerInputFormAPI = async (data) =>
//     API.post(`${POST_TWO_WHEELER_INSURANCE_FORM}`, data);
