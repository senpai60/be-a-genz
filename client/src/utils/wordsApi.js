import axios from "axios";

const wordsApi = axios.create({
  baseURL:
    `${import.meta.env.VITE_SERVER_URI}/words` || "http://localhost:3000/words",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default wordsApi;