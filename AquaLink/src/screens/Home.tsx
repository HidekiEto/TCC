import React, { Suspense, useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, StatusBar, Dimensions, ScrollView } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";

import WeekDays from "../components/HomeComponents/CalendarStrip";
import ModalComponent from "../components/HomeComponents/Modal";

const { width, height } = Dimensions.get('window');

const BOTTOM_NAV_HEIGHT = 60;
const HEADER_HEIGHT = 120;
const CALENDAR_SECTION_HEIGHT = 60;

const LiquidGauge = React.lazy(() =>
  import("../components/HomeComponents/LiquidGauge").then((mod) => {
    const comp =
      (mod as any).default ??
      (mod as any).LiquidGauge ??
      (mod as any).LUIQUIDGAUGE ??
      (mod as any);
    return { default: comp as React.ComponentType<any> };
  })
);
import BottomNavigation from "../components/BottomNavigation";

export default function Home() {
  const [waterValue, setWaterValue] = useState(44);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const getFirstName = () => {
    if (user?.displayName) {
      const nameParts = user.displayName.trim().split(' ');
      return nameParts[0];
    }
    
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      const emailParts = emailName.split('.');
      const firstName = emailParts[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }
    
    return "Usuário";
  };

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
            <Text style={styles.greeting}>Olá, {getFirstName()},</Text>
            <Text style={styles.subGreeting}>Bem vindo ao AquaLink.</Text>
          </View>
          <View style={styles.notificationButton}>
            <FontAwesome5 name="bell" size={20} color="white" />
          </View>
        </View>

        <View style={styles.calendarSection}>
          <WeekDays />
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.goalTitle}>Meta diária</Text>

          <Suspense
            fallback={
              <View style={styles.fallback}>
                <ActivityIndicator size="large" color="#084F8C" />
              </View>
            }
          > 
            <LiquidGauge 
              value={waterValue} 
              width={250}
              height={250}
              config={{
                circleColor: "#E0E0E0", // Cinza claro para o fundo
                waveColor: "#1976D2", // Azul da água
                textColor: "#1976D2", // Azul do texto
                waveTextColor: "#FFFFFF", // Texto branco sobre a água
                circleThickness: 0.05, // Borda mais grossa
                circleFillGap: 0.05, // Gap menor
                waveHeight: 0.05, // Ondas suaves
                waveCount: 1, // Duas ondas
                waveAnimate: true,
                waveAnimateTime: 4000, // Animação mais lenta
              }}
            />
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
          <ModalComponent
            title="Bateria"
            icon="battery"
            info1="Status da bateria: 53%"
            info2="Água restante na garrafa: 160 mL"
            info3="Tempo estimado de uso: 8 horas"
            buttonStyle={styles.batteryCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.batteryContent}>
                <MaterialCommunityIcons name="battery-60" size={60} color="#1976D2" style={styles.batteryIcon} />
                <View style={styles.batteryTextContent}>
                  <Text style={styles.batteryTitle}>Bateria:</Text>
                  <Text style={styles.batteryPercentage}>53%</Text>
                  <Text style={styles.batterySubtext}>Água restante na garrafa:</Text>
                  <Text style={styles.batterySubtext}>160 mL</Text>
                </View>
              </View>
            </View>
          </ModalComponent>
          
          {/* Card Lembretes - EXATAMENTE como na imagem */}
          <ModalComponent
            title="Lembretes"
            icon="clock-outline"
            info1="Próximo lembrete: 12:30h"
            info2="Lembretes configurados: 3"
            info3="Frequência: A cada 4 horas"
            buttonStyle={styles.reminderCard}
          >
            <View style={styles.cardContent}>
              <Text style={styles.reminderTitle}>Lembretes</Text>
              <View style={styles.reminderItem}>
                <Text style={styles.reminderBullet}>•</Text>
                <Text style={styles.reminderTime}>12h30</Text>
                <FontAwesome5 name="bell" size={12} color="white" />
              </View>
              <View style={styles.reminderItem}>
                <Text style={styles.reminderBullet}>•</Text>
                <Text style={styles.reminderTime}>16h00</Text>
                <FontAwesome5 name="bell" size={12} color="white" />
              </View>
              <View style={styles.reminderItem}>
                <Text style={styles.reminderBullet}>•</Text>
                <Text style={styles.reminderTime}>20h30</Text>
                <FontAwesome5 name="bell" size={12} color="white" />
              </View>
            </View>
          </ModalComponent>
        </View>

        {/* Bottom Navigation - Agora parte da View principal mas fixo no rodapé */}
        <BottomNavigation />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: 'white',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
  },
  notificationButton: {
    backgroundColor: '#27D5E8',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  calendarSection: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    backgroundColor: 'white',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#084F8C',
    textAlign: 'center',
  },
  addWaterButton: {
    marginTop: 20,
    marginBottom: 5,
    paddingVertical: 16,
    backgroundColor: '#084F8C',
    borderRadius: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addWaterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  bottomCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
    marginBottom: 80,
  },
  batteryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
    width: '65%',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reminderCard: {
    backgroundColor: '#27D5E8',
    borderRadius: 12,
    width: '30%',
    padding: 14,
    alignItems: 'flex-start',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 6,
    color: '#1976D2',
    alignSelf: 'flex-start',
  },
  batteryContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  batteryIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  batteryTextContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  batteryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  batteryPercentage: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  batterySubtext: {
    fontSize: 10,
    color: '#666',
    lineHeight: 12,
  },
  reminderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    width: '100%',
  },
  reminderBullet: {
    fontSize: 11,
    color: 'white',
    marginRight: 5,
  },
  reminderTime: {
    fontSize: 11,
    color: 'white',
    flex: 1,
  },
  cardContent: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  fallback: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
