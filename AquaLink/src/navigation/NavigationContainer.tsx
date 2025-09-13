import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../screens/Welcome";
import Register from "../screens/Register";
import Home from "../screens/Home";
import Login from "../screens/Login";
import CalendarScreen from "../screens/Calendar";
import Achievements from "../screens/Achievements";
import Dashboard from "../screens/Dashboard";
import Profile from "../screens/Profile";

// Definindo todas as rotas e seus parâmetros
export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Home: undefined;
  Login: undefined;
  Calendar: undefined;
  Profile: undefined;
  Achievements: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Achievements"
        component={Achievements}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
