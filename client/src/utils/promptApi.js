import axios from "axios";

const promptApi = axios.create({
  baseURL:
    `${import.meta.env.VITE_SERVER_URI}/prompt` || "http://localhost:3000/prompt",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default promptApi;

