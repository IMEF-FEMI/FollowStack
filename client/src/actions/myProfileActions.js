import {
  SET_PAGE,
  SET_PAGES,
  SET_INITIAL_FETCH,
  SET_IS_FETCHING,
  SET_HAS_MORE,
  SHARED_TWEETS_COUNT
} from "./types";
import { fetchTweetsForProfile } from "../async/post";
import axios from "axios";

export const initialFetchAction = (
  userData,
  keyInUse,
  page,
  token
) => async dispatch => {
  try {
    const { data: tweets } = await fetchTweetsForProfile(
      userData,
      keyInUse,
      page,
      token
    );

    dispatch(setPages(tweets.tweets));
    dispatch(setSharedTweetsCount(tweets.shared))
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
    const { data } = await fetchTweetsForProfile(
      userData,
      keyInUse,
      page,
      token
    );
    if (!data.tweets.length || !data.tweets) {
      dispatch(setHasMore(false));
      dispatch(setIsFetching(false));
    } else {
      dispatch(setIsFetching(false));
      dispatch(setPage(page + 1));
      dispatch(setPages(data.tweets));
    dispatch(setSharedTweetsCount(data.shared))

    }
    // console.log("tweets returned ", data);
  } catch (e) {
    if (axios.isCancel()) {
      return console.log(e.message);
    }
    console.log(e);
  }
};
export const setInitialFetch = bool => {
  return {
    type: SET_INITIAL_FETCH,
    payload: bool
  };
};

export const setPage = page => {
  return {
    type: SET_PAGE,
    payload: page
  };
};

export const setPages = pages => {
  return {
    type: SET_PAGES,
    payload: pages
  };
};

export const setIsFetching = bool => {
  return {
    type: SET_IS_FETCHING,
    payload: bool
  };
};
export const setHasMore = bool => {
  return {
    type: SET_HAS_MORE,
    payload: bool
  };
};

export const setSharedTweetsCount = count => {
return {
    type: SHARED_TWEETS_COUNT,
    payload: count
  };
}
