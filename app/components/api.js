import axios from "axios";
import jwt_decode from "jwt-decode";
var md5 = require('md5');
const buildAuthHeader = () => {
  const token = localStorage.getItem("token") || "";
  const headers = {
    Authorization: "Bearer " + token
  };
  return headers;
};

export const whoAmI = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  } else {
    console.log(token);
    const decoded = jwt_decode(token);
    const { userId, userName } = decoded;
    return { userId, userName };
  }
};

export const signin = (username, password) => {
  const body = {
    username,
    "password": md5(password)
  };
  const request_url = "/login";
  return axios.post(request_url, body);
}

export const signup = (username, email, password) => {
  const body = {
    username,
    email,
    "password": md5(password)
  };
  const request_url = "/register";
  return axios.post(request_url, body);
}

export const upload = (data, filename, extension) => {

  const headers = buildAuthHeader();
  headers["Content-Type"] = "multipart/form-data";
  const bodyFormData = new FormData();
  bodyFormData.append('data', data);
  bodyFormData.append('filename', filename);
  bodyFormData.append('extension', extension);
  const requestUrl = "/upload";
  return axios.post(requestUrl, bodyFormData, { headers });
}

export const delete_account = () => {
  const headers = buildAuthHeader();
  const requestUrl = "/delete_account";
  return axios.delete(requestUrl, headers = { headers })
}

export const get_from_link = (url) => {
  const requestUrl = "/view?u=" + url;
  return axios.get(requestUrl, {});
}
