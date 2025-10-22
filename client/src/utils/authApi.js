import axios from 'axios';
const authApi = axios.create({
  baseURL: (import.meta.env.VITE_SERVER_URI
    ? `${import.meta.env.VITE_SERVER_URI}/users`
    : "http://localhost:3000/users"),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});

export default authApi;
