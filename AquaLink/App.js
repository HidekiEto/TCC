import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/NavigationContainer';
import Slides from './src/components/Slider';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showNav, setShowNav] = useState(false);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return showNav ? (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  ) : (
    <Slides 
    
    onDone={() => setShowNav(true)} />
  );
}
