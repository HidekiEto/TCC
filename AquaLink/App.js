import React, { useState } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/NavigationContainer';

import Slides from './src/screens/Slider';
import Home from './src/screens/Home';
import Register from './src/screens/Register';
import NavCalendar from './src/components/NavCalendar';
import Login from './src/screens/Login'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export default function App() {
  const [showNav, setShowNav] = useState(false);

  return (
    showNav ? (
      <NavigationContainer>
        <Navigation/>
      </NavigationContainer>
    ) : (
      <Slides onDone={() => setShowNav(true)} />
    )

  //   <NavigationContainer>
  //   <Stack.Navigator initialRouteName="Login">
  //     <Stack.Screen name="Login" component={Login} />
  //     <Stack.Screen name="Home" component={Home} />
  //   </Stack.Navigator>
  // </NavigationContainer>
  );
}