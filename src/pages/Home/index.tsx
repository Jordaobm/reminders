import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Plus } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { Timeline } from "../../components/Timeline";
import { ReadAllRemindersDatabase } from "../../services/database";
import { COLORS, FONTS } from "../../styles/global";
import { groupingReminders, IGroupedReminders } from "../../utils/reminders";

export const Home = () => {
  const navigation = useNavigation();

  const [groupedReminders, setGroupedReminders] = useState<IGroupedReminders[]>(
    []
  );

  useFocusEffect(
    useCallback(() => {
      ReadAllRemindersDatabase().then((response) => {
        const reminders = groupingReminders(response);
        setGroupedReminders(reminders);
      });
    }, [])
  );

  return (
    <>
      <ScrollView style={{ backgroundColor: COLORS.white }}>
        <Header>
          <HeaderText>Lembretes</HeaderText>
        </Header>

        <ContainerTimeline>
          <Timeline groupedReminders={groupedReminders} />
        </ContainerTimeline>
      </ScrollView>

      <AddReminderButton onPress={() => navigation?.navigate("Reminder")}>
        <Plus size={24} color={COLORS.white} />
      </AddReminderButton>
    </>
  );
};

const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  color: ${COLORS.blue[900]};
  font-weight: bold;
  font-family: ${FONTS.medium};
`;
const AddReminderButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 4%;
  right: 4%;
  width: 60px;
  background-color: ${COLORS.blue[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.white};
  padding: 16px;
  border: 4px solid ${COLORS.white};
  border-radius: 16px;
`;

const ContainerTimeline = styled.View`
  margin-top: 4%;
`;
