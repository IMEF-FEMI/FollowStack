import axios from "axios";

export const registerUser = async userData => {
  const res = await axios.post("/api/users/register", userData);
  return res;
};
export const signInUser = async userData => {
  const res = await axios.post("/api/users/login", userData);
  return res;
};

export const deleteUser = async()=>{
  const res = await axios.delete('/api/users/delete-user')
  return res
}

export const checkUser = async id => {
  const res = await axios.get(`/api/users/check-user/${id}`);
  return res;
};

export const getUserProfile = async (userData, key) =>{
  const res = await axios.post(`/api/users/get-profile/${key}`, userData);
  return res;
}
export const getPoints = async(user_id)=>{
  const res = await axios.get(`/api/users/get-points/${user_id}`)
  return res;
}