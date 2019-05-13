import axios from "axios";

export const gainFollowers = async userData => {
  const twoMins = 2 * 60 * 1000;
  const res = await axios.post("/api/twitter/gain-followers", userData, {
    timeout: twoMins
  });
  return res;
};
export const beginUnFollow = async userData => {
  const res = await axios.post(`/api/twitter/unfollow`, userData);
  return res;
};

export const checkFollowing = async id => {
  const res = await axios.get(`/api/twitter/check-followings/${id}`);
  return res;
};

export const checkFollowedBack = async userData => {
  const res = await axios.post(`/api/twitter/get-followed-back`, userData);
  return res;
};
export const checkTotalGained = async userid => {
  const res = await axios.get(`/api/twitter/check-total-gained/${userid}`);
  return res;
};
