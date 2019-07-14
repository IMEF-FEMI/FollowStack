import {
  SET_TWEET_PAGE,
  SET_TWEET_PAGES,
  SET_TWEET_INITIAL_FETCH,
  SET_TWEET_IS_FETCHING,
  SET_TWEET_HAS_MORE,
  ADD_STATUS,
  REFRESH_TWEETS
} from "./types";
import { fetchTweetsForMain } from "../async/post";
import axios from "axios";

import store from "../store"


export const refreshTweetsAction =()=> async dispatch=>{
  var signal = axios.CancelToken.source();
  const storeObj = store.getState();
  dispatch(refreshTweets())
  dispatch(initialFetchAction(storeObj.auth.userData, storeObj.auth.keyInUse, 0, signal.token))
};

export const initialFetchAction = ( userData,  keyInUse,  page,  token) => async dispatch => {
  try {
    const { data: tweets } = await fetchTweetsForMain(
      userData,
      keyInUse,
      page,
      token
    );

    dispatch(setPages(tweets));
    dispatch(setPage(1));
    dispatch(setInitialFetch(false));

    // console.log("tweets returned ", tweets);
  } catch (e) {
    if (axios.isCancel()) {
      return console.log(e.message);
    }
    console.log(e);
  }
};

export const fetchNextAction = (
  userData,
  keyInUse,
  page,
  token
) => async dispatch => {
  try {
    dispatch(setIsFetching(true));
    // console.log("we here")
    const { data } = await fetchTweetsForMain(
      userData,
      keyInUse,
      page,
      token
    );
    if (!data.length) {
      dispatch(setHasMore(false));
      dispatch(setIsFetching(false));
    } else {
      dispatch(setIsFetching(false));
      dispatch(setPage(page + 1));
      dispatch(setPages(data));
    }
    // console.log("tweets returned ", data);
  } catch (e) {
    if (axios.isCancel()) {
      return console.log(e.message);
    }
    console.log(e);
  }
};
export const addStatus = (tweet) => async dispatch => {
  dispatch({
    type: ADD_STATUS,
    payload: tweet
  })
}


export const setInitialFetch = bool => {
  return {
    type: SET_TWEET_INITIAL_FETCH,
    payload: bool
  };
};

export const setPage = page => {
  return {
    type: SET_TWEET_PAGE,
    payload: page
  };
};

export const setPages = pages => {
  return {
    type: SET_TWEET_PAGES,
    payload: pages
  };
};

export const setIsFetching = bool => {
  return {
    type: SET_TWEET_IS_FETCHING,
    payload: bool
  };
};
export const setHasMore = bool => {
  return {
    type: SET_TWEET_HAS_MORE,
    payload: bool
  };
};

export const refreshTweets = ()=>{
  return{
    type: REFRESH_TWEETS
  }
}