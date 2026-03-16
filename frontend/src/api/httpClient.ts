import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://localhost:5199",
  withCredentials: false
});