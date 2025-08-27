import React, {useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';

import { View } from 'react-native';

import CalendarCompontent from '../components/CalendarComponent';
import BottomMenu from '../components/BottomNavigation';

export default function CalendarScreen() {

  return (
    <View className='flex-1'>
      <CalendarCompontent/>
      <BottomMenu/>
    </View>
    


  );
};

