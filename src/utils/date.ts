// Função que recebe a data 05/11/2022 10:00 e converte para 2022-11-05T10:00:00.000Z
export const parsedDate = (value: string) => {
  const [date, time] = value?.split(" ");
  const [day, month, year] = date?.split("/");
  const [hours, minutes] = time?.split(":");

  const stringDate = `${year}-${month}-${day}T${hours}:${minutes}:00.000`;

  return new Date(stringDate);
};

// Função que recebe a data 2022-11-05T10:00:00.000Z e converte para 05/11/2022 10:00
export const dateToString = (stringDate = "") => {
  const [date, time] = stringDate?.split("T");

  const [hours, minutes] = time?.split(":");

  const formattedDate = date?.split("-")?.reverse()?.join("/");

  return `${formattedDate} ${hours}:${minutes}`;
};

// Função que recebe a data e acerta os horários
export const dateWithoutTimezone = (receivedDate: Date) => {
  const date = String(receivedDate?.getDate())?.padStart(2, "0");
  const month = String(receivedDate?.getMonth() + 1)?.padStart(2, "0");
  const year = String(receivedDate?.getFullYear())?.padStart(2, "0");
  const hours = String(receivedDate?.getHours())?.padStart(2, "0");
  const minutes = String(receivedDate?.getMinutes())?.padStart(2, "0");

  const newDate = new Date(
    `${year}-${month}-${date}T${hours}:${minutes}:00.000`
  );

  return newDate;
};

// Função que recebe a data e acerta os horários
// Deve ser utilizada para adicionar a compensação do Timezone nas notificações
export const dateWithTimezone = (stringDate: string) => {
  const [date, time] = stringDate?.split("T");

  const [year, month, day] = date?.split("-");

  const [hours, minutes] = time?.split(":");

  const newDate = new Date(
    new Date(Number(year), Number(month) - 1, Number(day)).setHours(
      Number(hours)
    )
  ).setMinutes(Number(minutes));

  const parsed = new Date(newDate);

  return parsed;
};

// Função que recebe a data e remove as horas
export const getDateWithoutHour = (date: Date) => {
  return new Date(`${date.toISOString()?.split("T")[0]}T00:00:00.000`);
};
