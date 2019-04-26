import { Notifications, Permissions } from "expo";

export const pushNotificationsEnabled = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  console.log("hello", finalStatus);

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log("yes sir", status);
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  return true;
};

export const registerForPushNotifications = async () => {
  const enabled = await pushNotificationsEnabled();

  if (!enabled) {
    return Promise.resolve();
  }

  return Notifications.getExpoPushTokenAsync();
};

export const setBadgeNumber = (num = 0) =>
  Notifications.setBadgeNumberAsync(num);
