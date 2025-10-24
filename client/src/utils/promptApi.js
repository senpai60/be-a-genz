import axios from "axios";

// Ensure we don't end up with a string like "undefined/prompt" when
// VITE_SERVER_URI is not set in production. Follow same pattern as authApi.
const promptApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI
    ? `${import.meta.env.VITE_SERVER_URI}/prompt`
    : "http://localhost:3000/prompt",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

export default promptApi;

