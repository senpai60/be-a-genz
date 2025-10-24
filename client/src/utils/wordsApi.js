import axios from "axios";

// Ensure we don't end up with a string like "undefined/words" when
// VITE_SERVER_URI is not set in production. Mirror authApi behavior.
const wordsApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI
    ? `${import.meta.env.VITE_SERVER_URI}/words`
    : "http://localhost:3000/words",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

export default wordsApi;