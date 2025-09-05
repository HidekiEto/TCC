import React, { Suspense, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";

import WeekDays from "../components/HomeComponents/CalendarStrip";

const { width, height } = Dimensions.get('window');

// carregamento dinâmico robusto para módulos com export default ou export nomeado
const LuiquidGauge = React.lazy(() =>
  import("../components/HomeComponents/LuiquidGauge").then((mod) => {
    const comp =
      (mod as any).default ??
      (mod as any).LuiquidGauge ??
      (mod as any).LiquidGauge ??
      (mod as any).LUIQUIDGAUGE ??
      (mod as any);
    return { default: comp as React.ComponentType<any> };
  })
);
import BottomNavigation from "../components/BottomNavigation";

export default function Home() {
  const [waterValue, setWaterValue] = useState(14); // 14% como na imagem

  const waterIncrement = () => {
    setWaterValue((prev) => Math.min(prev + 30, 100));
  };

  return (
    <PaperProvider>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Header - EXATAMENTE como na imagem */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Olá, Samuel,</Text>
            <Text style={styles.subGreeting}>Bem vindo ao AquaLink.</Text>
          </View>
          <View style={styles.notificationButton}>
            <FontAwesome5 name="bell" size={20} color="white" />
          </View>
        </View>

        {/* Calendar Strip */}
        <View style={styles.calendarSection}>
          <WeekDays />
        </View>

        {/* Main Content - EXATAMENTE como na imagem */}
        <View style={styles.mainContent}>
          <Text style={styles.goalTitle}>Meta diária</Text>

          <Suspense
            fallback={
              <View style={styles.fallback}>
                <ActivityIndicator size="large" color="#084F8C" />
              </View>
            }
          >
            <LuiquidGauge value={waterValue} />
          </Suspense>

          <TouchableOpacity
            style={styles.addWaterButton}
            onPress={waterIncrement}
          >
            <Text style={styles.addWaterButtonText}>
              Adicionar Água
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Cards - EXATAMENTE como na imagem */}
        <View style={styles.bottomCards}>
          {/* Card Bateria - EXATAMENTE como na imagem */}
          <View style={styles.batteryCard}>
            <FontAwesome5 name="mobile-alt" size={24} color="#084F8C" style={styles.cardIcon} />
            <Text style={styles.batteryTitle}>Bateria</Text>
            <Text style={styles.batteryPercentage}>53%</Text>
            <Text style={styles.batterySubtext}>Água restante na garrafa:</Text>
            <Text style={styles.batterySubtext}>160 mL</Text>
          </View>
          
          {/* Card Lembretes - EXATAMENTE como na imagem */}
          <View style={styles.reminderCard}>
            <FontAwesome5 name="clock" size={20} color="#084F8C" style={styles.cardIcon} />
            <Text style={styles.reminderTitle}>Lembretes</Text>
            <Text style={styles.reminderTime}>• 12:30h</Text>
            <Text style={styles.reminderTime}>• 16:30h</Text>
            <Text style={styles.reminderTime}>• 18:30h</Text>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <BottomNavigation />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  notificationButton: {
    backgroundColor: '#27D5E8',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarSection: {
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#084F8C',
    marginBottom: 20,
  },
  addWaterButton: {
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: '#084F8C',
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  addWaterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
    backgroundColor: '#F8F9FA',
  },
  batteryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    flex: 0.65,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  reminderCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    flex: 0.35,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 5,
  },
  batteryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#084F8C',
    marginBottom: 3,
  },
  batteryPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  batterySubtext: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 12,
  },
  reminderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#084F8C',
    marginBottom: 3,
  },
  reminderTime: {
    fontSize: 11,
    color: '#084F8C',
    marginBottom: 1,
  },
  bottomNavigation: {
    backgroundColor: '#F8F9FA',
  },
  fallback: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
