import React, { Component } from 'react';
import { View, AppState } from 'react-native';
import { Notifications, Permissions } from "expo";
import { setBadgeNumber } from "./pushNotifications;

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

export class PushNotificationManager extends Component {
  static defaultProps = {
    onPushNotificationSelected: () => null
  }

  componentDidMount() {
    setBadgeNumber(0);
    // Use AppState listener for when notification comes while app is open
    AppState.addEventListener("change", this.handleAppStateChange);
    this.notificationSubscription = Notifications.addListener(this.handlePushNotification)
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.notificationSubscription.remove()
  }

  handleAppStateChange = nextAppState => {
    // When app state changes to active remove badge count
    if (nextAppState === "active") {
      setBadgeNumber(0);
    }
  };

  handlePushNotification = ({ data, origin }) => {
    if (origin === 'selected') {
      // User opened the app via push
      this.props.onPushNotificationSelected(data)
    }
    else if (origin === 'received') {
      // App was open when notification was received
    }
  }
  
  render() {
    return <View style={{ flex: 1 }}>{this.props.children}</View>
  }
}
