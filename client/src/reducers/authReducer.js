import isEmpty from "../validation/is-empty";

import { SET_CURRENT_USER, SET_USER_DATA } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  userData: {}
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
    default:
      return state; 
  }
}
