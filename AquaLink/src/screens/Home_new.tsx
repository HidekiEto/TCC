import React, { Suspense, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";

import WeekDays from "../components/HomeComponents/CalendarStrip";
import ModalComponent from "../components/HomeComponents/Modal";

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
      <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Header */}
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
        <WeekDays />

        {/* Main Content */}
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

        {/* Bottom Cards */}
        <View style={styles.bottomCards}>
          <ModalComponent 
            title="Status da Bateria"
            icon="battery-70"
            info1="Bateria: 53%"
            info2="Água restante na garrafa: 160 mL"
            buttonClassName={styles.batteryCard}
          />
          
          <ModalComponent 
            title="Lembretes"
            icon="bell"
            info1="• 12:30h"
            info2="• 16:30h" 
            info3="• 18:30h"
            buttonClassName={styles.reminderCard}
          />
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
    paddingVertical: 20,
    gap: 15,
  },
  batteryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    flex: 0.6,
    height: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    flex: 0.4,
    height: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  fallback: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
