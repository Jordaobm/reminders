import uuid from "react-native-uuid";
import Realm from "realm";
import { IReminder } from "../@types/Reminder";
import { Notification } from "./Notification";

const ReminderSchema = {
  name: "Reminder",
  properties: {
    id: "string",
    description: "string?",
    title: "string",
    type: "string",
    date: "string",
    interval: "int?",
  },
  primaryKey: "id",
};

const config = {
  path: "agendaApp",
  schema: [ReminderSchema],
};

const { createNotifications, cancelNotification } = Notification();

export const CreateReminderDatabase = async (reminder: IReminder) => {
  const realm = await Realm.open(config);

  const saveReminder: IReminder = {
    ...reminder,
    id: String(uuid.v4()),
    interval: Number(reminder?.interval) || 0,
  };

  realm.write(() => {
    realm.create("Reminder", saveReminder);
  });

  createNotifications(saveReminder);

  realm.close();
};

export const ReadAllRemindersDatabase = async () => {
  const realm = await Realm.open(config);

  const data = realm.objects("Reminder");

  const reminders: IReminder[] = [];

  for (let i = 0; i < data.length; i++) {
    const reminder: any = data[i];

    const formattedProduct: IReminder = {
      id: reminder?.id,
      title: reminder?.title,
      date: reminder?.date,
      description: reminder?.description,
      interval: reminder?.interval,
      type: reminder?.type,
    };

    reminders.push(formattedProduct);
  }

  realm.close();

  return reminders;
};

export const UpdateReminderDatabase = async (updateReminder: IReminder) => {
  const realm = await Realm.open(config);

  const data: any = realm
    .objects("Reminder")
    .filtered("id= $0", updateReminder?.id);

  const reminders: IReminder[] = [];

  for (let i = 0; i < data.length; i++) {
    const product: any = data[i];

    reminders.push(product);
  }

  realm.write(() => {
    reminders[0].id = updateReminder?.id;
    reminders[0].date = updateReminder?.date;
    reminders[0].description = updateReminder?.description;
    reminders[0].interval = updateReminder?.interval;
    reminders[0].title = updateReminder?.title;
    reminders[0].type = updateReminder?.type;
  });

  await cancelNotification(updateReminder?.id);

  createNotifications(updateReminder);

  realm.close();

  return updateReminder;
};

export const DeleteReminderDatabase = async (reminderId: string) => {
  const realm = await Realm.open(config);

  const reminder: any = realm
    .objects("Reminder")
    .filtered("id= $0", reminderId);

  realm.write(() => {
    realm.delete(reminder);
  });

  await cancelNotification(reminderId);

  realm.close();
};
