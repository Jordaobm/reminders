/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { RootStackParamList } from "../@types/navigation";
import { Home } from "../pages/Home";
import { Reminder } from "../pages/Reminder";
import { StatusBar } from "react-native";
import { COLORS } from "../styles/global";

export const Routes = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
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
