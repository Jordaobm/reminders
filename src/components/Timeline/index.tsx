import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import React from "react";
import styled from "styled-components/native";
import { COLORS, FONTS } from "../../styles/global";
import { TYPES } from "../../utils/constantes";
import { dateWithoutTimezone } from "../../utils/date";
import { IGroupedReminders } from "../../utils/reminders";

interface TimelineProps {
  groupedReminders: IGroupedReminders[];
}

export const Timeline = ({ groupedReminders }: TimelineProps) => {
  const navigation = useNavigation();

  return (
    <Container>
      {groupedReminders?.map((groupedReminder) => {
        const date = format(
          dateWithoutTimezone(new Date(groupedReminder?.date)),
          "dd 'de' MMM",
          { locale: ptBr }
        );

        return (
          <ReminderGroup key={groupedReminder?.id}>
            <ReminderGroupText>{date}</ReminderGroupText>

            <Reminders>
              {groupedReminder?.reminders?.map((reminder) => {
                let color = "";

                if (reminder?.type === "unique") {
                  color = COLORS.green[500];
                }

                if (reminder?.type === "days") {
                  color = COLORS.red[500];
                }

                if (reminder?.type === "month") {
                  color = COLORS.blue[800];
                }

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
                    <ReminderType>{TYPES[reminder?.type]?.label}</ReminderType>
                  </Reminder>
                );
              })}
            </Reminders>
          </ReminderGroup>
        );
      })}
    </Container>
  );
};

export const Container = styled.View`
  width: 100%;
  padding: 0 4%;
  padding-bottom: 120px;
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
