/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../@types/navigation";
import { Home } from "../pages/Home";
import { Reminder } from "../pages/Reminder";

export const Routes = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

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
