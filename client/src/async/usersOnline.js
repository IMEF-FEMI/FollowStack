import axios from "axios";



export const getOnlineUsers = async (userData, key) => {
  const twoMins = 2 * 60 * 1000;
  const res = await axios.post(`/api/users-online/get/${key}`, userData, {
    timeout: twoMins
  });
  return res;
};
export const unFollow = async (newUser,userData) => {
  const res = await axios.post(`/api/users-online/unfollow`, {newUser, userData});
  return res;
};

export const finishUnFollow = async (userData)=>{
  const res = await axios.post(`/api/users-online/finish-unfollow`, {userData});
  return res;
}

export const follow = async (newUser,userData) => {
  const res = await axios.post(`/api/users-online/follow`, {newUser, userData});
  return res;
};

export const checkFollowing = async id => {
  const res = await axios.get(`/api/users-online/check-followings/${id}`);
  return res;
};

export const checkFollowedBack = async (userData, key)=> {
  const res = await axios.post(`/api/users-online/get-followed-back/${key}`, userData);
  return res;
};

export const getNotFollowingBack = async (userData, key)=> {
  const res = await axios.post(`/api/users-online/get-unfollow-list/${key}`, userData);
  return res;
};

