/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { RootStackParamList } from "../@types/navigation";
import { Home } from "../pages/Home";
import { Reminder } from "../pages/Reminder";
import NotifService from "../services/NotifService";

const notifService = new NotifService();

export const Routes = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    notifService.localNotif();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Home"
            component={Home}
          />

          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Reminder"
            component={Reminder}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
