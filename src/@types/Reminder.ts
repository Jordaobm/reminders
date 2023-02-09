export interface IReminder {
  id: string;
  description: string;
  title: string;
  type: "unique" | "days" | "month" | "weekly";
  date: string;
  interval: number;
}
