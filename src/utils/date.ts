// Função que recebe a data 05/11/2022 10:00 e converte para 2022-11-05T10:00:00.000Z
export const parsedDate = (value: string) => {
  const [date, time] = value?.split(" ");
  const [day, month, year] = date?.split("/");
  const [hours, minutes] = time?.split(":");

  const stringDate = `${year}-${month}-${day}T${hours}:${minutes}:00.000`;

  return new Date(stringDate);
};

// Função que recebe a data e remove o Timezone
export const dateWithoutTimezone = (date: Date) => {
  return new Date(date.toISOString().slice(0, -1));
};
