import { useEffect } from "react";
import PushNotification from "react-native-push-notification";
import { IReminder } from "../@types/Reminder";
import { IGroupedReminders } from "../utils/reminders";

export const Notification = () => {
  useEffect(() => {
    createDefaultChannels();
  }, []);

  PushNotification.getApplicationIconBadgeNumber(function (number) {
    if (number > 0) {
      PushNotification.setApplicationIconBadgeNumber(0);
    }
  });

  PushNotification.getChannels(() => {});

  const createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // (required)
        channelName: "Default channel", // (required)
        channelDescription: "A default channel", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      () => console.log() // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  interface ScheduleNotificationProps {
    title: string;
    date: Date;
    message: string;
    reminder: IReminder;
  }

  const reminderNotification = ({
    date,
    message = "",
    title,
    reminder,
  }: ScheduleNotificationProps) => {
    PushNotification.localNotificationSchedule({
      title,
      date,
      message,
      allowWhileIdle: false,
      channelId: "default-channel-id",
      userInfo: reminder,
    });
  };

  const cancelNotification = (notificationId: string) => {
    PushNotification.cancelLocalNotifications({ id: "" + notificationId });
  };

  const cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  const getReminderNotifications = (callback: any) => {
    return PushNotification.getScheduledLocalNotifications(callback);
  };

  return {
    reminderNotification,
    getReminderNotifications,
    cancelAllNotifications,
    cancelNotification,
  };
};

export const manageNotifications = (groupedReminders: IGroupedReminders[]) => {
  console.log(groupedReminders);
};
