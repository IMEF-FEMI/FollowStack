import {
  SET_ONLINE_USERS,
  UO_SET_FOLLOWED_BACK,
  UO_SET_HAS_FOLLOWINGS,
  UO_SET_HAS_FOLLOWINGS_TIME,
  UO_SET_GETTING_USERS,
  UO_SET_IS_UNFOLLOWING,
  UO_SET_CHECKING_FOLLOWINGS,
  UO_SET_CHECKING_FOLLOWED_BACK,
  UO_SET_CHECKING_NOT_FOLLOWED_BACK,
  UO_SET_NOT_FOLLOWING_BACK,
  UO_SET_LINEAR_PROGRESS_BAR_COMPLETED
} from "../actions/types";

const initialState = {
  onlineUsers: [],
  followedBack: [],
  notFollowingBack: [],
  gettingUsers: false,
  isUnFollowing: false,
  hasFollowingsTime: 0,
  hasFollowings: false,
  checkingFollowings: true,
  checkingFollowedBack: true,
  checkingNotFollowedBack: true,
  linearProgressBarCompleted: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.payload
      };
    case UO_SET_FOLLOWED_BACK:
      return {
        ...state,
        followedBack: action.payload
      };
    case UO_SET_NOT_FOLLOWING_BACK:
      return {
        ...state,
        notFollowingBack: action.payload
      };
    case UO_SET_GETTING_USERS:
      return {
        ...state,
        gettingUsers: action.payload
      };
    case UO_SET_IS_UNFOLLOWING:
      return {
        ...state,
        isUnFollowing: action.payload
      };
    case UO_SET_HAS_FOLLOWINGS:
      return {
        ...state,
        hasFollowings: action.payload
      };
    case UO_SET_HAS_FOLLOWINGS_TIME:
      return {
        ...state,
        hasFollowingsTime: action.payload
      };
    case UO_SET_CHECKING_FOLLOWINGS:
      return {
        ...state,
        checkingFollowings: action.payload
      };
    case UO_SET_CHECKING_FOLLOWED_BACK:
      return {
        ...state,
        checkingFollowedBack: action.payload
      };
    case UO_SET_CHECKING_NOT_FOLLOWED_BACK:
      return {
        ...state,
        checkingNotFollowedBack: action.payload
      };
    case UO_SET_LINEAR_PROGRESS_BAR_COMPLETED:
      return {
        ...state,
        linearProgressBarCompleted: action.payload
      };
    default:
      return state;
  }
}
