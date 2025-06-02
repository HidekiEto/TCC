import React from 'react';
import { StatusBar, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/NavigationContainer';

import InitialScreen from './src/screens/initialScreen';
import SecondSlider from './src/screens/SecondSlider';


export default function App(){
  return(
    <SecondSlider/>
  // <InitialScreen />
    // <NavigationContainer>
    //   <StatusBar backgroundColor="#1081c7" barStyle="light-content"/>
    //   <Navigation/>
    // </NavigationContainer>
    
  );
}