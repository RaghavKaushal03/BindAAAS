import axios from "axios";
export default axios.create({
  baseURL: "https://bindaaas.herokuapp.com/v1/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
