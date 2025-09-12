import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-backend-v0pw.onrender.com/api/todos",
})

export default API;