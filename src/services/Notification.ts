import PushNotification, { Importance } from "react-native-push-notification";
import { IReminder } from "../@types/Reminder";
import { dateWithoutTimezone } from "../utils/date";
import { IGroupedReminders, parsedReminders } from "../utils/reminders";

const CHANNEL_ID = "agendaAppChannelId";
const CHANNEL_NAME = "agendaAppChannelName";
const SOUND_NAME = "my_sound.mp3";

interface INotification {
  data: IReminder;
  date: string;
  id: string;
  message: string;
  number: null;
  repeatInterval: null;
  soundName: null;
  title: string;
}

export const Notification = () => {
  PushNotification.createChannel(
    {
      channelId: CHANNEL_ID, // (required)
      channelName: CHANNEL_NAME, // (required)
      soundName: SOUND_NAME, // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    () => {} // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.getApplicationIconBadgeNumber(function (number) {
    if (number > 0) {
      PushNotification.setApplicationIconBadgeNumber(0);
    }
  });

  PushNotification.getChannels(() => {});

  const createNotifications = async (receivedReminder: IReminder) => {
    const reminders = parsedReminders(receivedReminder);

    reminders?.forEach((reminder) =>
      PushNotification.localNotificationSchedule({
        title: reminder?.title || "",
        date: dateWithoutTimezone(new Date(reminder?.date)),
        message: reminder?.description || "",
        allowWhileIdle: true,
        channelId: CHANNEL_ID,
        userInfo: reminder,
        soundName: SOUND_NAME,
      })
    );
  };

  const cancelNotification = async (reminderId: string) => {
    const notifications = await getReminderNotifications();

    notifications?.forEach((notification) => {
      if (notification?.data?.id === reminderId) {
        PushNotification.cancelLocalNotification(notification?.id);
      }
    });
  };

  const cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  const getReminderNotifications = async () => {
    const getNotificationsPromise = new Promise((resolve) => {
      PushNotification.getScheduledLocalNotifications((notifications) =>
        resolve(notifications)
      );
    });

    const notifications = await getNotificationsPromise;

    return notifications as INotification[];
  };

  const localNotification = () => {
    PushNotification.localNotification({
      message: "sim",
      channelId: CHANNEL_ID,
      soundName: "default",
    });
  };

  return {
    localNotification,
    createNotifications,
    getReminderNotifications,
    cancelAllNotifications,
    cancelNotification,
  };
};

export const manageNotifications = (groupedReminders: IGroupedReminders[]) => {
  console.log(groupedReminders);
};
