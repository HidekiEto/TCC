import React, { useState } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/NavigationContainer';

import Slides from './src/screens/Slider';
import Home from './src/screens/Home';
import Register from './src/screens/Register';


export default function App() {
  const [showNav, setShowNav] = useState(false);

  return (
    showNav ? (
      <NavigationContainer>
        <StatusBar backgroundColor="#1081c7" barStyle="light-content"/>
        <Navigation/>
      </NavigationContainer>
    ) : (
      <Slides onDone={() => setShowNav(true)} />
    )

  );
}