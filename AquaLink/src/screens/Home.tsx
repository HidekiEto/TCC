import React, { Suspense, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, StatusBar, Dimensions, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import WeekDays from "../components/HomeComponents/CalendarStrip";
import ModalComponent from "../components/HomeComponents/Modal";

const { width, height } = Dimensions.get('window');

// Constantes para cálculo responsivo
const BOTTOM_NAV_HEIGHT = 60;
const HEADER_HEIGHT = 120;
const CALENDAR_SECTION_HEIGHT = 60;

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
  const [waterValue, setWaterValue] = useState(44); // 44% como na imagem

  const waterIncrement = () => {
    setWaterValue((prev) => Math.min(prev + 30, 100));
  };

  return (
    <PaperProvider>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Main Content Container - TODOS os componentes exceto BottomNavigation */}
        <View style={styles.mainContainer}>
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
              <LuiquidGauge 
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
                <FontAwesome5 name="mobile-alt" size={24} color="#1976D2" style={styles.cardIcon} />
                <Text style={styles.batteryTitle}>Bateria</Text>
                <Text style={styles.batteryPercentage}>53%</Text>
                <Text style={styles.batterySubtext}>Água restante na garrafa:</Text>
                <Text style={styles.batterySubtext}>160 mL</Text>
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
                <FontAwesome5 name="clock" size={20} color="#1976D2" style={styles.cardIcon} />
                <Text style={styles.reminderTitle}>Lembretes</Text>
                <Text style={styles.reminderTime}>• 12:30h</Text>
                <Text style={styles.reminderTime}>• 16:30h</Text>
                <Text style={styles.reminderTime}>• 18:30h</Text>
              </View>
            </ModalComponent>
          </View>
        </View>

        {/* Bottom Navigation - Separado do container principal */}
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
  mainContainer: {
    flex: 1, // Volta para flex: 1 para ocupar toda a tela
    backgroundColor: '#FFFFFF',
    paddingBottom: 70, // Espaço para o BottomNavigation absoluto (altura 60 + margem)
    bottom: '5%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 70,
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
    flex: 1, // Ocupa o espaço disponível
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    maxHeight: height * 0.5, // Limita a altura máxima para 50% da tela
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#084F8C',
    marginBottom: 5,
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
    backgroundColor: '#FFFFFF',
    marginBottom: 0, // Remove margem que pode causar overlap
    top: 15, // Garante que o container fique no topo do espaço disponível
  },
  batteryCard: {
    backgroundColor: '#F5F5F5', // Cinza claro como na imagem
    borderRadius: 15,
    flex: 0.65,
    padding: 12,
    alignItems: 'center',
    height: 120, // Altura fixa para evitar expansão
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
    backgroundColor: '#F5F5F5', // Cinza claro como na imagem
    borderRadius: 15,
    flex: 0.35,
    padding: 12,
    alignItems: 'center',
    height: 120, // Altura fixa para evitar expansão
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
    color: '#1976D2', // Azul como na imagem
  },
  batteryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2', // Azul como na imagem
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
    color: '#1976D2', // Azul como na imagem
    marginBottom: 3,
  },
  reminderTime: {
    fontSize: 11,
    color: '#1976D2', // Azul como na imagem
    marginBottom: 1,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
