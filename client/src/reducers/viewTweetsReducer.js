import {
  SET_TWEET_PAGE,
  SET_TWEET_PAGES,
  SET_TWEET_INITIAL_FETCH,
  SET_TWEET_IS_FETCHING,
  SET_TWEET_HAS_MORE
} from "../actions/types";

const initialState = {
  tweetPage: 0,
  tweetPages: [],
  tweetInitialFetch: true,
  tweetIsFetching: false,
  tweetHasMore: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TWEET_PAGE:
      return {
        ...state,
        tweetPage: action.payload
      };
    case SET_TWEET_PAGES:
      return {
        ...state,
        tweetPages: [...state.tweetPages, ...action.payload]
      };

    case SET_TWEET_INITIAL_FETCH:
      return {
        ...state,
        tweetInitialFetch: action.payload
      };
    case SET_TWEET_IS_FETCHING:
      return {
        ...state,
        tweetIsFetching: action.payload
      };
    case SET_TWEET_HAS_MORE:
      return {
        ...state,
        tweetHasMore: action.payload
      };

    default:
      return state;
  }
}
