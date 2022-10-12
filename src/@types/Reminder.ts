export interface IReminder {
  id: string;
  description: string;
  title: string;
  type: "unique" | "days" | "month";
  date: string;
  interval: number;
}
