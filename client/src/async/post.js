import axios from "axios";

export const fetchTweetsForProfile = async (
  userData,
  key,
  page,
  cancelToken
) => {
  const res = await axios.post(
    `/api/post/get-profile-tweets/${key}/${page}`,
    userData,
    { cancelToken }
  );
  return res;
};
export const fetchTweetsForMain = async (
  userData,
  key,
  page,
  cancelToken
) => {
  const res = await axios.post(
    `/api/post/get-main-tweets/${key}/${page}`,
    userData,
    { cancelToken }
  );
  return res;
};

export const addTweetPost = async (user_id, tweet) => {
  const res = await axios.post(`/api/post/add-tweet/`, { user_id, tweet });
  return res;
};

export const removeTweetPost = async (id_str, user_id) => {
  const res = await axios.delete(`/api/post/remove-tweet/${id_str}/${user_id}`);
  return res;
};

export const postComment = async (userData, comment, tweet, key) => {
  const res = axios.post(`/api/post/post-comment/${key}`, {
    userData,
    comment,
    tweet
  });
  return res;
};

export const postLike = async (userData, tweet, key) => {
  const res = axios.post(`/api/post/post-like/${key}`, { userData, tweet });
  return res;
};

export const unPostLike = async (userData, tweet, key) => {
  const res = axios.post(`/api/post/unpost-like/${key}`, { userData, tweet });
  return res;
};

export const postRetweet = async (userData, tweet, key) => {
  const res = axios.post(`/api/post/post-retweet/${key}`, { userData, tweet });
  return res;
};

export const unPostRetweet = async (userData, tweet, key) => {
  const res = axios.post(`/api/post/unpost-retweet/${key}`, { userData, tweet });
  return res;
};
