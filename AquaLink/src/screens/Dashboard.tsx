import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import BottomNavigation from "../components/BottomNavigation";
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BarChartComponent } from "../components/DashboardComponents/BarChart";
import { calcularMetaSemanalAgua, useConsumoUltimasSemanas } from '../components/Goals/WeeklyIntake';
import { useBLE } from "../contexts/BLEProvider";
import { useDbContext } from "../hooks/useDbContext";


export default function Dashboard() {
  // Relatório semanal de hidratação
  const [profileData, setProfileData] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { firestore } = await import('../config/firebase');
          const docRef = doc(firestore, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          let data = docSnap.exists() ? docSnap.data() : {};
          setProfileData({
            peso: Number(data.weight) || 70,
            altura: Number(data.height) || 170,
            genero: (data.gender || 'masculino').toLowerCase(),
            idade: data.birthdate ? (new Date().getFullYear() - new Date(data.birthdate).getFullYear()) : 30,
            uid: currentUser.uid,
          });
        } catch (e) {
          setProfileData(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Atualiza gráfico ao voltar para tela
  const { useFocusEffect } = require('@react-navigation/native');
  useFocusEffect(
    React.useCallback(() => {
      // Força atualização do BarChartComponent ao voltar para tela
      setProfileData((prev: any) => prev ? { ...prev } : prev);
    }, [profileData?.uid])
  );


  // Consumo mensal e comparação
  const [consumoMensal, setConsumoMensal] = useState(0);
  const [consumoMensalAnterior, setConsumoMensalAnterior] = useState(0);

  useEffect(() => {
    async function calcularConsumoMensal() {
      if (!profileData?.uid) return;
      let leituras = [];
      try {
        const cacheStr = await AsyncStorage.getItem(`leiturasCache_${profileData.uid}`);
        leituras = cacheStr ? JSON.parse(cacheStr) : [];
      } catch (e) {
        leituras = [];
      }
      const mesAtual = dayjs().format('YYYY-MM');
      const mesAnterior = dayjs().subtract(1, 'month').format('YYYY-MM');
      let somaAtual = 0;
      let somaAnterior = 0;
      for (const leitura of leituras) {
        if (typeof leitura.consumo === 'number' && leitura.timestamp) {
          const mesLeitura = dayjs(leitura.timestamp).format('YYYY-MM');
          if (mesLeitura === mesAtual) {
            somaAtual += leitura.consumo;
          } else if (mesLeitura === mesAnterior) {
            somaAnterior += leitura.consumo;
          }
        }
      }
      setConsumoMensal(somaAtual);
      setConsumoMensalAnterior(somaAnterior);
    }
    calcularConsumoMensal();
  }, [profileData]);
  const { sincronizarCacheComBanco } = useDbContext();
  const { scanForDevices, isScanning, isConnected, connectedDevice, foundDevices, connectToDevice, disconnectDevice, batteryLevel } = useBLE();
  const [modalVisible, setModalVisible] = useState(false);

  const handleScan = () => {
    setModalVisible(true);
    scanForDevices();
  };

  const handleConnect = (deviceId: string) => {
    connectToDevice(deviceId);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modalContainer}>
              <Text style={modalStyles.modalTitle}>Dispositivos Bluetooth Encontrados</Text>
              {isScanning && (
                <View style={{ alignItems: "center", marginVertical: 12 }}>
                  <ActivityIndicator size="large" color="#082862" />
                  <Text>Procurando dispositivos...</Text>
                </View>
              )}
              {!isScanning && foundDevices.length === 0 && (
                <Text style={{ textAlign: "center", marginVertical: 12 }}>
                  Nenhum dispositivo encontrado.
                </Text>
              )}
              <ScrollView style={{ maxHeight: 200 }}>
                {foundDevices
                  .filter(device => device.name === "ESP32C3_AquaLink")
                  .map((device) => (
                    <TouchableOpacity
                      key={device.id}
                      style={modalStyles.deviceButton}
                      onPress={() => handleConnect(device.id)}
                    >
                      <MaterialCommunityIcons name="bluetooth" size={20} color="#082862" />
                      <Text style={modalStyles.deviceText}>
                        {device.name || "Sem nome"} ({device.id})
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={modalStyles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Este é o seu Painel de Controle</Text>
          {isConnected && connectedDevice ? (
            <Text style={[styles.headerSubtitle, { color: '#4CAF50', fontWeight: 'bold' }]}>
              Garrafa conectada: AquaLink Classic
            </Text>
          ) : (
            <Text style={[styles.headerSubtitle, { color: '#F44336', fontWeight: 'bold' }]}>
              Nenhuma garrafa conectada
            </Text>
          )}
        </View>


        <View style={styles.dashboardTitle}>
          <MaterialIcons name="dashboard" size={24} color="#AAAAAA" />
          <Text style={styles.dashboardText}>
            Dashboard
            <Text style={styles.dashboardSubtext}> / Visão Geral</Text>
            <Text style={styles.periodText}>
              {`Últimos ${dayjs().daysInMonth()} dias`}
            </Text>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </Text>
        </View>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="water" size={20} color="#082862" />
            <Text style={styles.cardTitle}>Total Ingerido</Text>
          </View>
          <Text style={styles.totalValue}>{consumoMensal} mL</Text>
          <Text style={styles.comparison}>
            {consumoMensalAnterior > 0
              ? `${(consumoMensal - consumoMensalAnterior).toFixed(1)} mL ${consumoMensal >= consumoMensalAnterior ? 'mais' : 'menos'} que passado`
              : '0 mL mais que passado'}
          </Text>
        </View>


        <View style={styles.chartContainer}>
          {/* Passa os dados do usuário para o BarChartComponent */}
          <BarChartComponent userData={profileData} />
        </View>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="bell-ring" size={20} color="#082862" />
            <Text style={styles.cardTitle}>Lembretes</Text>
          </View>
          <Text style={styles.nextReminder}>Próximo Lembrete: 21h30</Text>
          <Text style={styles.reminderSubtitle}>Duração de Lembretes</Text>
          <View style={styles.timeOptions}>
            <View style={styles.timeOption}>
              <View style={styles.timeCircle} />
              <Text style={styles.timeText}>19h30</Text>
            </View>
            <View style={styles.timeOption}>
              <View style={styles.timeCircle} />
              <Text style={styles.timeText}>18h30</Text>
            </View>
            <View style={styles.timeOption}>
              <View style={styles.timeCircle} />
              <Text style={styles.timeText}>09h30</Text>
            </View>
          </View>
        </View>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="calculator" size={20} color="#082862" />
            <Text style={styles.cardTitle}>Horários</Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationTime}>08h30</Text>
            <Text style={styles.calculationValue}>50 mL</Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationTime}>07h30</Text>
            <Text style={styles.calculationValue}>30 mL</Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationTime}>06h00</Text>
            <Text style={styles.calculationValue}>80 mL</Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationTime}>05h30</Text>
            <Text style={styles.calculationValue}>30 mL</Text>
          </View>
        </View>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="information" size={20} color="#082862" />
            <Text style={styles.cardTitle}>Sua Garrafa</Text>
          </View>
          

          <View style={styles.garrafaContent}>
            <View style={styles.bottleImageContainer}>
              <Text style={styles.garrafaSubtitle}>AquaLink Classic</Text>
              <Image
                source={require('../assets/bottle.png')}
                style={styles.bottleImage}
                resizeMode="contain"
              />
              <Text style={styles.cadastradaText}>Cadastrada em: 28/08/2025</Text>
            </View>

            {/* Linha vertical separadora */}
            <View style={styles.verticalSeparator} />

            <View style={styles.garrafaInfo}>
              <View style={styles.garrafaInfoRow}>
                <View style={styles.statusIndicator} />
                <Text style={styles.garrafaInfoText}>
                  Bateria: {batteryLevel !== null ? `${batteryLevel}%` : '---'}
                </Text>
              </View>
              <View style={styles.garrafaInfoRow}>
                <View style={[styles.statusIndicator, { backgroundColor: '#29EBD5' }]} />
                <Text style={styles.garrafaInfoText}>Água na Garrafa:</Text>
              </View>
              <Text style={styles.garrafaInfoValue}>1200 mL</Text>
              <View style={styles.garrafaInfoRow}>
                <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.garrafaInfoText}>Capacidade:</Text>
              </View>
              <Text style={styles.garrafaInfoValue}>2000 mL</Text>
              <View style={{ flexDirection: 'column', gap: 8, marginTop: 12 }}>
                <TouchableOpacity
                  style={styles.resincronizarButton}
                  onPress={handleScan}
                  disabled={isScanning}
                >
                  <MaterialCommunityIcons name="bluetooth" size={16} color="white" />
                  <Text style={styles.resincronizarText}>
                    {isScanning ? "Procurando..." : "Ressincronizar"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.resincronizarButton, { backgroundColor: '#2196F3' }]}
                  onPress={() => {
                    if (connectedDevice?.id) {
                      sincronizarCacheComBanco(connectedDevice?.id);
                    } else {
                      alert("Nenhuma garrafa conectada.");
                    }
                  }}
                  disabled={!isConnected}
                >
                  <MaterialCommunityIcons name="cloud-upload" size={15} color="white" />
                  <Text style={styles.resincronizarText}>Sincronizar Leituras</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Informativos Cards */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="information" size={20} color="#082862" />
            <Text style={styles.cardTitle}>Informativos</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoImagePlaceholder}>
              <MaterialCommunityIcons name="water-outline" size={40} color="#29EBD5" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Beber água é importante para o bom funcionamento do organismo
              </Text>
              <Text style={styles.infoLink}>https://orientacoesnutricionais.com.br/67</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoImagePlaceholder}>
              <MaterialCommunityIcons name="heart-outline" size={40} color="#29EBD5" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Beber água é importante para o bom funcionamento do organismo
              </Text>
              <Text style={styles.infoLink}>https://orientacoesnutricionais.com.br/67</Text>
            </View>
          </View>
        </View>


        <View style={styles.bottomSpace} />
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxHeight: "70%",
    alignItems: "stretch",
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#082862",
    marginBottom: 16,
    textAlign: "center",
  },
  deviceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    marginBottom: 8,
  },
  deviceText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#082862",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#082862",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  verticalSeparator: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: width * 0.02,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: width * 0.04,
  },
  header: {
    paddingTop: height * 0.03,
    paddingBottom: height * 0.012,
  },
  headerTitle: {
    fontSize: Math.round(width * 0.045),
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: Math.round(width * 0.035),
    fontWeight: '200',
    color: '#666',
  },
  dashboardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
  },
  dashboardText: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '200',
    marginLeft: width * 0.02,
    color: '#333',
  },
  dashboardSubtext: {
    fontWeight: '400',
  },
  periodText: {
    fontSize: Math.round(width * 0.035),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: width * 0.04,
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  cardTitle: {
    fontSize: Math.round(width * 0.045),
    fontWeight: '600',
    marginLeft: width * 0.02,
    color: '#082862',
  },
  totalValue: {
    fontSize: Math.round(width * 0.08),
    fontWeight: 'bold',
    color: '#082862',
    textAlign: 'center',
    marginVertical: height * 0.01,
  },
  comparison: {
    fontSize: Math.round(width * 0.035),
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
    marginVertical: height * 0.01,
  },
  nextReminder: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '500',
    color: '#333',
    marginBottom: height * 0.01,
  },
  reminderSubtitle: {
    fontSize: Math.round(width * 0.035),
    color: '#666',
    marginBottom: height * 0.015,
  },
  timeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeCircle: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: '#29EBD5',
    marginRight: width * 0.015,
  },
  timeText: {
    fontSize: Math.round(width * 0.035),
    color: '#333',
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.008,
  },
  calculationTime: {
    fontSize: Math.round(width * 0.035),
    color: '#666',
  },
  calculationValue: {
    fontSize: Math.round(width * 0.035),
    fontWeight: '500',
    color: '#333',
  },
  batteryInfo: {
    marginBottom: height * 0.02,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  batteryText: {
    fontSize: Math.round(width * 0.035),
    marginLeft: width * 0.015,
    color: '#4CAF50',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  capacityText: {
    fontSize: Math.round(width * 0.035),
    marginLeft: width * 0.015,
    color: '#29EBD5',
  },
  capacityValue: {
    fontSize: Math.round(width * 0.035),
    color: '#666',
    marginBottom: height * 0.005,
  },
  capacityAmount: {
    fontSize: Math.round(width * 0.045),
    fontWeight: '600',
    color: '#082862',
  },
  bottleImageContainer: {
    alignItems: 'center',
    marginTop: height * 0.015,
  },
  bottleImage: {
    width: width * 0.45,
    height: height * 0.18,
  },
  garrafaSubtitle: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '600',
    color: '#082862',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  garrafaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cadastradaText: {
    fontSize: Math.round(width * 0.03),
    color: '#999',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  garrafaInfo: {
    flex: 1,
    marginLeft: width * 0.01,
  },
  garrafaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  statusIndicator: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: '#082862',
    marginRight: width * 0.02,
  },
  garrafaInfoText: {
    fontSize: Math.round(width * 0.035),
    color: '#333',
    fontWeight: '500',
  },
  garrafaInfoValue: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '600',
    color: '#082862',
    marginLeft: width * 0.04,
    marginBottom: height * 0.01,
  },
  resincronizarButton: {
    backgroundColor: '#082862',
    borderRadius: 20,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: height * 0.015,
  },
  resincronizarText: {
    color: 'white',
    fontSize: Math.round(width * 0.035),
    fontWeight: '500',
    marginLeft: width * 0.015,
  },
  infoCard: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: width * 0.03,
  },
  infoImagePlaceholder: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Math.round(width * 0.035),
    fontWeight: '500',
    color: '#333',
    marginBottom: height * 0.005,
    lineHeight: Math.round(width * 0.045),
  },
  infoLink: {
    fontSize: Math.round(width * 0.03),
    color: '#29EBD5',
  },
  bottomSpace: {
    height: height * 0.12,
  },
});
