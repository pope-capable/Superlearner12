import axios from "axios";

// team-user url

// const baseUrl = "http://localhost:8000/"
const baseUrl = "https://supper-learner-team.herokuapp.com/";

// project url
// const projectBaseUrl = "http://localhost:8000/"
const projectBaseUrl = "https://project-microservice.herokuapp.com/";

// folder url
// const folderBaseUrl = "https://main-folder-ms.herokuapp.com/";
const folderBaseUrl = "http://localhost:5000/"

export function simplePost(location, data) {
  axios.post(`${baseUrl}/${location}`, data).then((response) => {
    return response;
  });
}

export function postWithHeaders(location, data, headers) {
  return axios.post(baseUrl + location, data, { headers });
}

export function getWithHeaders(location, headers) {
  return axios.get(baseUrl + location, { headers });
}

// project calls here
export function projectSimplePost(location, data) {
  axios.post(`${projectBaseUrl}/${location}`, data).then((response) => {
    return response;
  });
}

export function projectPostWithHeaders(location, data, headers) {
  return axios.post(projectBaseUrl + location, data, { headers });
}

export function projectGetWithHeaders(location, headers) {
  return axios.get(projectBaseUrl + location, { headers });
}

// folder calls here

export function FolderGetWithHeaders(location, headers) {
  return axios.get(folderBaseUrl + location, { headers });
}

export function folderPostWithHeaders(location, data, headers) {
  return axios.post(folderBaseUrl + location, data, { headers });
}
