import { ADD_NOTIFICATION, MARK_AS_READ } from "./types";

export const addNotificationAction = notification => async dispatch => {
  dispatch(addNotification(notification));
};
export const markAllAsReadAction = bool => async dispatch => {
  dispatch(markAllAsRead(bool));
};


export const addNotification = notification => {
  return {
    type: ADD_NOTIFICATION,
    payload: notification
  };
};
export const markAllAsRead = bool => {
  return {
    type: MARK_AS_READ,
    payload: bool
  };
};
