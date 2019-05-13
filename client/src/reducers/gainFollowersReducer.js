import {
  SET_FOLLOWINGS,
  SET_FOLLOWED_BACK,
  SET_STATS,
  SET_HAS_FOLLOWINGS,
  SET_HAS_FOLLOWINGS_TIME,
  SET_IS_FOLLOWING,
  SET_IS_UNFOLLOWING,
  SET_CHECKING_FOLLOWINGS,
  SET_CHECKING_FOLLOWED_BACK,
  SET_LINEAR_PROGRESS_BAR_COMPLETED,
  SET_SHOW_FOLLOWED_TAB,
  SET_TOTAL_GAINED
} from "../actions/types";

const initialState = {
  followings: [],
  followedBack: [],
  stats: {
    unFollowed: []
  },
  isFollowing: false,
  isUnFollowing: false,
  hasFollowingsTime: 0,
  hasFollowings: false,
  checkingFollowings: true,
  checkingFollowedBack: true,
  linearProgressBarCompleted: 0,
  showFollowedTab: true,
  totalGained: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FOLLOWINGS:
      return {
        ...state,
        followings: action.payload
      };
    case SET_FOLLOWED_BACK:
      return {
        ...state,
        followedBack: action.payload
      };
    case SET_STATS:
      return {
        ...state,
        stats: action.payload
      };
    case SET_IS_FOLLOWING:
      return {
        ...state,
        isFollowing: action.payload
      };
    case SET_IS_UNFOLLOWING:
      return {
        ...state,
        isUnFollowing: action.payload
      };
    case SET_HAS_FOLLOWINGS:
      return {
        ...state,
        hasFollowings: action.payload
      };
    case SET_HAS_FOLLOWINGS_TIME:
      return {
        ...state,
        hasFollowingsTime: action.payload
      };
    case SET_CHECKING_FOLLOWINGS:
      return {
        ...state,
        checkingFollowings: action.payload
      };
    case SET_CHECKING_FOLLOWED_BACK:
      return {
        ...state,
        checkingFollowedBack: action.payload
      };
    case SET_LINEAR_PROGRESS_BAR_COMPLETED:
      return {
        ...state,
        linearProgressBarCompleted: action.payload
      };
    case SET_SHOW_FOLLOWED_TAB:
      return {
        ...state,
        showFollowedTab: action.payload
      };
    case SET_TOTAL_GAINED:
      return {
        ...state,
        totalGained: action.payload
      };

    default:
      return state;
  }
}
