import { ADD_NOTIFICATION, MARK_AS_READ } from "../actions/types";

const initialState = {
  notifications: [],
  read: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        notifications: [...state.notifications, action.payload],
        read: false
      };

    case MARK_AS_READ:
      return {
        ...state,
        read: action.payload
      };

    default:
      return state;
  }
}
