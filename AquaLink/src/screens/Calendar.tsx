import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, StatusBar, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import CalendarCompontent from "../components/CalendarScreenComponents/CalendarComponent";
import BottomNavigation from "../components/BottomNavigation";
import SliderComponent from "../components/CalendarScreenComponents/SliderComponent";
import { EvilIcons } from '@expo/vector-icons';
import { CalendarProvider } from "../contexts/CalendarContext";
import { useCalendarContext } from "../hooks/useCalendarContext";
import { useFocusEffect } from "@react-navigation/native";

import { useAppFonts } from "../hooks/useAppFonts";

const { width, height } = Dimensions.get('window');

const BOTTOM_NAV_HEIGHT = 60;
const BOTTOM_NAV_PADDING = 30;
const HEADER_HEIGHT = 100;
const AVAILABLE_HEIGHT = height - BOTTOM_NAV_HEIGHT - BOTTOM_NAV_PADDING - HEADER_HEIGHT;

function CalendarContent() {
  const { refreshCalendarData } = useCalendarContext();
  const hasLoadedRef = useRef(false);
  
  useFocusEffect(
    React.useCallback(() => {
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
        return;
      }
      
      console.log('📅 [Calendar] Tela ganhou foco, atualizando dados...');
      refreshCalendarData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.container}>
        
        <View style={styles.contentArea}>
        
          <View style={styles.header}>
            <EvilIcons name="calendar" size={50} color="#27D5E8"/>
            <Text style={styles.headerTitle}>
              Calendário
            </Text>
          </View>

        
          <ScrollView 
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
          
            <View style={styles.calendarContainer}>
              <CalendarCompontent />
            </View>

            
            <LinearGradient
              colors={["black", "white", "black"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientDivider}
            />
            
            
            <View style={styles.sliderContainer}>
              <SliderComponent />
            </View>
          </ScrollView>
        </View>

  
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
}

export default function CalendarScreen() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) return null;

  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentArea: {
    flex: 1,
    paddingBottom: BOTTOM_NAV_HEIGHT + 10, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    height: HEADER_HEIGHT,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#27D5E8',
    marginLeft: 0,
    fontFamily: 'Poppins-Regular',
    
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20, 
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 10,
    minHeight: 350, 
  },
  gradientDivider: {
    height: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sliderContainer: {
    minHeight: 180, 
    paddingHorizontal: 10,
  },
});
