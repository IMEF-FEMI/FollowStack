import { ADD_NOTIFICATION, MARK_ALL_AS_READ,SET_NOTIFICATIONS, CLEAR_NOTIFICATIONS } from "../actions/types";

const initialState = {
  notifications: [],
  unreadCount: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        notifications: [...state.notifications, action.payload],
        unreadCount: state.unreadCount + 1
      };

case SET_NOTIFICATIONS:
  return {
    ...state,
    notifications: action.payload.notifications,
    unreadCount: action.payload.unread_count
  }
    case MARK_ALL_AS_READ:
      return {
        ...state,
        unreadCount: 0
      };

      case CLEAR_NOTIFICATIONS:
      return initialState;

    default:
      return state;
  }
}
