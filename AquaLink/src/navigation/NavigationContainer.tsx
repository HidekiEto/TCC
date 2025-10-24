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
import InitialSlidesScreen from "../screens/InitialSlidesScreen";
import ReminderSettings from "../screens/ReminderSettings";
import type { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface NavigationProps {
  initialRouteName?: keyof RootStackParamList;
}

export default function Navigation({ initialRouteName = "Welcome" }: NavigationProps) {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={require('../screens/SplashScreen').default}
        options={{ headerShown: false }}
      />
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
        name="EditProfile"
        component={require('../components/ProfileComponents/EditProfile').default}
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
      <Stack.Screen
        name="InitialSlidesScreen"
        component={InitialSlidesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReminderSettings"
        component={ReminderSettings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={require('../screens/Settings').default}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
