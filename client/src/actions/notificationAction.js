import {
  ADD_NOTIFICATION,
  SET_NOTIFICATIONS,
  MARK_ALL_AS_READ,
  CLEAR_NOTIFICATIONS
} from "./types";

export const setNotifications = notification => async dispatch => {
  // console.log("we here")
  dispatch({
    type: SET_NOTIFICATIONS,
    payload: notification
  });
};

export const addNotificationAction = notification => async dispatch => {
  dispatch(addNotification(notification));
};

export const markAllAsReadAction = (socket, user_id) => async dispatch => {
  socket.emit("mark-as-read", user_id);
  dispatch(markAllAsRead());
};

export const clearNotificationsAction = (socket, user_id) => async dispatch => {
  dispatch({
    type: CLEAR_NOTIFICATIONS
  });
  socket.emit("clear-notifications", user_id);
};

export const addNotification = notification => {
  return {
    type: ADD_NOTIFICATION,
    payload: notification
  };
};
export const markAllAsRead = () => {
  return {
    type: MARK_ALL_AS_READ
  };
};
