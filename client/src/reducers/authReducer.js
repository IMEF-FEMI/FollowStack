import isEmpty from "../validation/is-empty";

import {
  SET_CURRENT_USER,
  SET_USER_DATA,
  SET_USER_PROFILE,
  SET_KEY
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  userData: {},
  userProfile: {},
  keyInUse: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      };

    case SET_KEY:
      return {
        ...state,
        keyInUse: action.payload
      };
    default:
      return state;
  }
}
