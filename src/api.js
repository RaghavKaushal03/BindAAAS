import axios from "axios";
export default axios.create({
  // baseURL: "https://bindaaas.herokuapp.com/v1/",
  baseURL: "http://localhost:5000/v1/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
