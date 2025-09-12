import axios from "axios";

const API = axios.create({
  baseURL: window.location.hostname === "localhost" ? "http://localhost:5000/api/todos" : "https://todo-backend-v0pw.onrender.com/api/todos",
})

export default API;