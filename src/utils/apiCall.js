import axios from "axios";
import {
  CREATE_NOTE,
  DELETE_ACCESS,
  DELETE_NOTE,
  GET_ALL_ACCESS,
  GET_ALL_NOTES,
  GIVE_ACCESS,
  LOGIN,
  REGISTER,
} from "./endPoints";

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

// get all notes
export const getNotesApi = async (route, query = "") => {
  const token = getToken();
  return API.get(`${GET_ALL_NOTES}/${route}?${query}`, {
    headers: {
      Authorization: token || "",
    },
  });
};

// register user
export const registerApi = async (data) => {
  const token = getToken();
  return API.post(`${REGISTER}`, data, {
    headers: {
      Authorization: token || "",
    },
  });
};

// login user
export const loginApi = async (data) => {
  const token = getToken();
  return API.post(`${LOGIN}`, data, {
    headers: {
      Authorization: token || "",
    },
  });
};

// add or update new note
export const createNoteApi = async (route, data, passcode) => {
  const token = getToken();
  let url = `${CREATE_NOTE}/${route}`;
  passcode && url + `?passcode=${passcode}`;
  return API.post(url, data, {
    headers: {
      Authorization: token || "",
    },
  });
};

// delte note
export const deleteNoteApi = async (route, id, passcode) => {
  const token = getToken();
  let url = `${DELETE_NOTE}/${route}/${id}`;
  passcode && url + `?passcode=${passcode}`;
  return API.delete(url, {
    headers: {
      Authorization: token || "",
    },
  });
};

// get all access
export const getAllAccessApi = async () => {
  const token = getToken();
  return API.get(`${GET_ALL_ACCESS}`, {
    headers: {
      Authorization: token || "",
    },
  });
};

// give access
export const giveAccessApi = async (data) => {
  const token = getToken();
  return API.post(`${GIVE_ACCESS}`, data, {
    headers: {
      Authorization: token || "",
    },
  });
};

// Update access
export const updateAccessApi = async (id, data) => {
  const token = getToken();
  return API.put(`${EDIT_ACCESS}/${id}`, data, {
    headers: {
      Authorization: token || "",
    },
  });
};

// Delete access
export const deleteAccessApi = async (id, data) => {
  const token = getToken();
  return API.delete(`${DELETE_ACCESS}/${id}`, {
    headers: {
      Authorization: token || "",
    },
    data,
  });
};
