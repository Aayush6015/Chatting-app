// services/userService.js
import axios from "./axiosInstance.js";
// import axios from "axios";

export const searchUsers = async (query) => {
  const res = await axios.get(`/users/search?username=${query}`, {
    withCredentials: true,
  });
  console.log("this is from user service",res);
  return res.data.users;
};
