import { addDays, addMonths, isBefore } from "date-fns";
import { IReminder } from "../@types/Reminder";
import { dateWithoutTimezone } from "./date";
import uuid from "react-native-uuid";

export interface IGroupedReminders {
  date: string;
  id: string;
  reminders: IReminder[];
}

export const groupingReminders = (receivedReminders: IReminder[]) => {
  const reminders: IReminder[] = [];

  receivedReminders?.forEach((reminder) => {
    reminders?.push(...parsedReminders(reminder));
  });

  const groupedByDay: IGroupedReminders[] = reminders?.reduce(
    (acc, reminder) => {
      const [reminderDate] = reminder?.date?.split("T");

      const remindersInDate = reminders?.filter(
        (e) => e?.date?.split("T")[0] === reminderDate
      );

      const alreadyExistInAcc = acc?.find(
        (e) => e?.date?.split("T")[0] === reminderDate
      );

      if (alreadyExistInAcc) {
        return acc;
      }

      return (acc = [
        ...acc,
        {
          date: reminder?.date,
          id: String(uuid.v4()),
          reminders: remindersInDate,
        },
      ]);
    },
    [] as IGroupedReminders[]
  );

  groupedByDay?.sort((reminderA, reminderB) =>
    reminderA?.date >= reminderB?.date ? 1 : -1
  );

  return groupedByDay;
};

export const parsedReminders = (reminder: IReminder) => {
  const reminders: IReminder[] = [];

  const lastDateOfCurrentYear = new Date(new Date().getUTCFullYear(), 11, 31);

  if (reminder?.type === "days" && reminder?.interval) {
    let reminderDate = dateWithoutTimezone(new Date(reminder?.date));

    for (
      reminderDate;
      isBefore(reminderDate, lastDateOfCurrentYear);
      reminderDate = addDays(reminderDate, reminder?.interval)
    ) {
      const newReminder: IReminder = {
        ...reminder,
        date: reminderDate?.toISOString(),
      };
      reminders?.push(newReminder);
    }
  }

  if (reminder?.type === "month") {
    let reminderDate = dateWithoutTimezone(new Date(reminder?.date));

    for (
      reminderDate;
      isBefore(reminderDate, lastDateOfCurrentYear);
      reminderDate = addMonths(reminderDate, 1)
    ) {
      const newReminder: IReminder = {
        ...reminder,
        date: reminderDate?.toISOString(),
      };
      reminders?.push(newReminder);
    }
  }

  if (reminder?.type === "unique") {
    reminders?.push(reminder);
  }

  return reminders;
};
