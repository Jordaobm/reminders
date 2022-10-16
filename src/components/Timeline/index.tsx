import { useNavigation } from "@react-navigation/native";
import { isAfter, isBefore, isEqual, isToday } from "date-fns";
import React, { useMemo, useState } from "react";
import styled from "styled-components/native";
import { COLORS, FONTS } from "../../styles/global";
import { FILTERS, MONTHS, TYPES } from "../../utils/constantes";
import { dateWithoutTimezone, getDateWithoutHour } from "../../utils/date";
import { IGroupedReminders } from "../../utils/reminders";

interface TimelineProps {
  groupedReminders: IGroupedReminders[];
}

export const Timeline = ({ groupedReminders }: TimelineProps) => {
  const navigation = useNavigation();

  const [filter, setFilter] = useState(FILTERS.next.value);

  const groupedRemindersAfterFilter = useMemo(() => {
    const filtered = groupedReminders?.filter((grouped) => {
      const currentDate = getDateWithoutHour(dateWithoutTimezone(new Date()));

      const dateGroup = getDateWithoutHour(new Date(grouped?.date));

      if (filter === FILTERS.next.value) {
        if (
          isEqual(dateGroup, currentDate) ||
          isAfter(dateGroup, currentDate)
        ) {
          return grouped;
        }
      }

      if (filter === FILTERS.past.value) {
        if (isBefore(dateGroup, currentDate)) {
          return grouped;
        }
      }

      if (filter === FILTERS.all.value) {
        return grouped;
      }
    });

    return filtered;
  }, [groupedReminders, filter]);

  return (
    <Container>
      <ContainerFilters>
        <Button
          opacity={filter === FILTERS.next.value ? 1 : 0.3}
          onPress={() => setFilter(FILTERS.next.value)}
        >
          <ButtonText>Próximos</ButtonText>
        </Button>
        <Button
          opacity={filter === FILTERS.past.value ? 1 : 0.3}
          onPress={() => setFilter(FILTERS.past.value)}
        >
          <ButtonText>Passados</ButtonText>
        </Button>
        <Button
          opacity={filter === FILTERS.all.value ? 1 : 0.3}
          onPress={() => setFilter(FILTERS.all.value)}
        >
          <ButtonText>Todos</ButtonText>
        </Button>
      </ContainerFilters>

      <ContainerReminders>
        {groupedRemindersAfterFilter?.map((groupedReminder) => {
          const date = new Date(groupedReminder?.date);

          return (
            <ReminderGroup key={groupedReminder?.id}>
              <ReminderGroupText>{`${date?.getUTCDate()} de ${
                MONTHS[date?.getUTCMonth() + 1]
              }`}</ReminderGroupText>

              <Reminders>
                {groupedReminder?.reminders?.map((reminder) => {
                  let color = COLORS.blue[800];

                  if (isToday(new Date(reminder?.date))) {
                    color = COLORS.green[500];
                  }

                  if (
                    isBefore(
                      new Date(reminder?.date),
                      dateWithoutTimezone(new Date())
                    )
                  ) {
                    color = COLORS.red[500];
                  }

                  const reminderDate = new Date(reminder?.date);

                  const hours = `${String(
                    reminderDate?.getUTCHours()
                  )?.padStart(2, "0")}:${String(
                    reminderDate?.getUTCMinutes()
                  )?.padStart(2, "0")} `;

                  return (
                    <Reminder
                      backgroundColor={color}
                      key={reminder?.id}
                      onPress={() => navigation.navigate("Reminder", reminder)}
                    >
                      <ReminderTitle>{reminder?.title}</ReminderTitle>
                      <ReminderDescription>
                        {reminder?.description}
                      </ReminderDescription>
                      <ReminderType>
                        {hours} {TYPES[reminder?.type]?.label}
                      </ReminderType>
                    </Reminder>
                  );
                })}
              </Reminders>
            </ReminderGroup>
          );
        })}
      </ContainerReminders>
    </Container>
  );
};

export const Container = styled.View`
  width: 100%;
  padding: 0 4%;
  padding-bottom: 120px;
`;

export const ContainerReminders = styled.View`
  width: 100%;
`;

export const ContainerFilters = styled.View`
  width: 100%;
  flex-direction: row;
`;

interface ButtonProps {
  opacity: number;
}
export const Button = styled.TouchableHighlight<ButtonProps>`
  width: 100px;
  background-color: ${COLORS.button};
  opacity: ${(props) => props.opacity};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  margin-right: 8px;
`;
export const ButtonText = styled.Text`
  font-family: ${FONTS.bold};
  color: ${COLORS.blue[900]};
`;

export const ReminderGroup = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 4% 0;
  align-items: center;
`;
export const ReminderGroupText = styled.Text`
  width: 40%;
  font-size: 18px;
  font-family: ${FONTS.bold};
  color: ${COLORS.black};
  opacity: 0.8;
`;

export const Reminders = styled.View`
  width: 60%;
`;

interface ReminderProps {
  backgroundColor: string;
}

export const Reminder = styled.TouchableOpacity<ReminderProps>`
  width: 100%;
  background-color: ${(props) => props?.backgroundColor};
  margin: 2% 0;
  padding: 12px;
  border-radius: 8px;
`;

export const ReminderTitle = styled.Text`
  font-size: 16px;
  font-family: ${FONTS.bold};
  color: ${COLORS.white};
`;
export const ReminderDescription = styled.Text`
  font-size: 12px;
  font-family: ${FONTS.medium};
  color: ${COLORS.white};
`;
export const RemindeReminderTyperDescription = styled.Text`
  font-size: 12px;
  font-family: ${FONTS.medium};
  color: ${COLORS.white};
`;
export const ReminderType = styled.Text`
  font-size: 10px;
  font-family: ${FONTS.medium};
  color: ${COLORS.white};
`;
