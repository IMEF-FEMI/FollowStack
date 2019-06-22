import store from "../../../../../../../../../store";

export const getNotifications = (limit = 6) => {
  const notifs = store.getState().notifications.notifications;

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        notifications: notifs.slice(0, limit),
        notificationsCount: notifs.length
      });
    }, 700);
  });
};
