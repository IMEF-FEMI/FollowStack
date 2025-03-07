import {
  SET_PAGE,
  SET_PAGES,
  SET_INITIAL_FETCH,
  SET_IS_FETCHING,
  SET_HAS_MORE,
  SHARED_TWEETS_COUNT,
  REFRESH_PROFILE
} from "../actions/types";

const initialState = {
  page: 0,
  pages: [],
  initialFetch: true,
  isFetching: false,
  hasMore: true,
  shareTweetsCount: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: action.payload
      };
    case SET_PAGES:
      return {
        ...state,
        pages: [...state.pages, ...action.payload]
      };

    case SHARED_TWEETS_COUNT:
      return {
        ...state,
        shareTweetsCount: action.payload
      }

    case SET_INITIAL_FETCH:
      return {
        ...state,
        initialFetch: action.payload
      };
    case SET_IS_FETCHING:
      return {
        ...state,
        isFetching: action.payload
      };
    case SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.payload
      };

    case REFRESH_PROFILE:
    return{
      ...initialState
    }

    default:
      return state;
  }
}
