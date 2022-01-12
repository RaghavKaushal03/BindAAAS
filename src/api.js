import axios from "axios";
export default axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://bindaaas.herokuapp.com/v1/"
      : "http://localhost:5000/v1/",
  // baseURL: "http://localhost:5000/v1/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
