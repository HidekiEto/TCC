import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Platform, Alert, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import BottomNavigation from "../components/BottomNavigation";
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BarChartComponent } from "../components/DashboardComponents/BarChart";
import { calcularMetaSemanalAgua, useConsumoUltimasSemanas } from '../components/Goals/WeeklyIntake';
import { useBLE } from "../contexts/BLEProvider";
import { useDbContext } from "../hooks/useDbContext";
import { useReminders } from "../contexts/ReminderContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDataContext } from "../hooks/useDataContext";


export default function Dashboard() {
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

  const { useFocusEffect } = require('@react-navigation/native');
  useFocusEffect(
    React.useCallback(() => {
      setProfileData((prev: any) => prev ? { ...prev } : prev);
    }, [profileData?.uid])
  );


  const [consumoMensal, setConsumoMensal] = useState(0);
  const [consumoMensalAnterior, setConsumoMensalAnterior] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const calcularConsumoMensal = useCallback(async () => {
    if (!profileData?.uid) return;
    
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { firestore } = await import('../config/firebase');
      
      const mesAtual = dayjs().format('YYYY-MM');
      const mesAnterior = dayjs().subtract(1, 'month').format('YYYY-MM');
      
      const startDateAtual = `${mesAtual}-01`;
      const endDateAtual = dayjs().endOf('month').format('YYYY-MM-DD');
      
      const qAtual = query(
        collection(firestore, "consumoDiario"),
        where("userId", "==", profileData.uid),
        where("date", ">=", startDateAtual),
        where("date", "<=", endDateAtual)
      );
      
      const snapshotAtual = await getDocs(qAtual);
      let somaFirestoreAtual = 0;
      snapshotAtual.forEach((doc) => {
        somaFirestoreAtual += doc.data().total || 0;
      });
      
      const cacheKey = `leiturasCache_${profileData.uid}`;
      const cacheStr = await AsyncStorage.getItem(cacheKey);
      const leituras = cacheStr ? JSON.parse(cacheStr) : [];
      
      let somaCacheAtual = 0;
      let somaCacheAnterior = 0;
      
      for (const leitura of leituras) {
        if (typeof leitura.consumo === 'number' && leitura.timestamp) {
          const mesLeitura = dayjs(leitura.timestamp).format('YYYY-MM');
          if (mesLeitura === mesAtual) {
            somaCacheAtual += leitura.consumo;
          } else if (mesLeitura === mesAnterior) {
            somaCacheAnterior += leitura.consumo;
          }
        }
      }
      
      const startDateAnterior = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
      const endDateAnterior = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
      
      const qAnterior = query(
        collection(firestore, "consumoDiario"),
        where("userId", "==", profileData.uid),
        where("date", ">=", startDateAnterior),
        where("date", "<=", endDateAnterior)
      );
      
      const snapshotAnterior = await getDocs(qAnterior);
      let somaFirestoreAnterior = 0;
      snapshotAnterior.forEach((doc) => {
        somaFirestoreAnterior += doc.data().total || 0;
      });
      
      const totalAtual = Math.round(somaFirestoreAtual + somaCacheAtual);
      const totalAnterior = Math.round(somaFirestoreAnterior + somaCacheAnterior);
      
      setConsumoMensal(totalAtual);
      setConsumoMensalAnterior(totalAnterior);
      
      console.log('📊 [Dashboard] ========== CONSUMO MENSAL ==========');
      console.log('☁️ [Dashboard] Firestore (atual):', Math.round(somaFirestoreAtual), 'ml');
      console.log('� [Dashboard] Cache local (atual):', Math.round(somaCacheAtual), 'ml');
      console.log('💧 [Dashboard] TOTAL COMBINADO (atual):', totalAtual, 'ml');
      console.log('📊 [Dashboard] Mês anterior:', totalAnterior, 'ml');
      console.log('📊 [Dashboard] =========================================');
    } catch (e) {
      console.error('❌ [Dashboard] Erro ao buscar consumo mensal:', e);
      setConsumoMensal(0);
      setConsumoMensalAnterior(0);
    }
  }, [profileData]);

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 [Dashboard] Tela ganhou foco - recarregando dados...');
      calcularConsumoMensal();
      setRefreshTrigger(prev => prev + 1); // Força atualização dos gráficos
    }, [calcularConsumoMensal])
  );

  const { sincronizarCacheComBanco } = useDbContext();
  const { scanForDevices, isScanning, isConnected, connectedDevice, foundDevices, connectToDevice, disconnectDevice, batteryLevel } = useBLE();
  const [modalVisible, setModalVisible] = useState(false);
  
  const dataContext = useDataContext();
  const volumeAtual = dataContext?.volume ?? null;
  
  const navigation = useNavigation<any>();
  const { 
    config, 
    scheduledCount, 
    hasPermission, 
    getNextReminderTime,
    toggleReminders 
  } = useReminders();

  const handleScan = () => {
    setModalVisible(true);
    scanForDevices();
  };

  const handleConnect = (deviceId: string) => {
    connectToDevice(deviceId);
    setModalVisible(false);
  };

  const handleReminderSettings = () => {
    navigation.navigate('ReminderSettings');
  };

  const handleToggleReminders = async () => {
    try {
      await toggleReminders(!config.enabled);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar os lembretes');
    }
  };

  const getNext3Reminders = (): Date[] => {
    if (!config.enabled) return [];
    
    const now = new Date();
    const times: Date[] = [];
    const { startHour, endHour, intervalMinutes } = config;
    
    let checkTime = new Date(now);
    checkTime.setSeconds(0, 0);
    
    const currentMinutes = checkTime.getHours() * 60 + checkTime.getMinutes();
    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60;
    
    let nextMinutes = startMinutes;
    
    if (currentMinutes < startMinutes) {
      nextMinutes = startMinutes;
    } else {
      while (nextMinutes <= currentMinutes && nextMinutes <= endMinutes) {
        nextMinutes += intervalMinutes;
      }
      
      if (nextMinutes > endMinutes) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(startHour, 0, 0, 0);
        times.push(tomorrow);
        
        nextMinutes = startMinutes + intervalMinutes;
        const second = new Date(tomorrow);
        second.setHours(Math.floor(nextMinutes / 60), nextMinutes % 60, 0, 0);
        times.push(second);
        
        nextMinutes += intervalMinutes;
        const third = new Date(tomorrow);
        third.setHours(Math.floor(nextMinutes / 60), nextMinutes % 60, 0, 0);
        times.push(third);
        
        return times.slice(0, 3);
      }
    }
    
    for (let i = 0; i < 3 && nextMinutes <= endMinutes; i++) {
      const nextTime = new Date(now);
      nextTime.setHours(Math.floor(nextMinutes / 60), nextMinutes % 60, 0, 0);
      
      if (nextTime <= now) {
        nextTime.setDate(nextTime.getDate() + 1);
      }
      
      times.push(nextTime);
      nextMinutes += intervalMinutes;
    }
    
    return times.slice(0, 3);
  };

  const nextReminders = getNext3Reminders();
  const formatTime = (date: Date) => 
    `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F7FA" barStyle="dark-content" />
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
              <Text style={styles.garrafaInfoValue}>
                {isConnected && volumeAtual !== null 
                  ? `${Math.round(volumeAtual)} mL` 
                  : '--- mL'}
              </Text>
              
              {/* Barra de Progresso de Água */}
              {isConnected && volumeAtual !== null && (
                <View style={styles.waterProgressContainer}>
                  <View style={styles.waterProgressBar}>
                    <View 
                      style={[
                        styles.waterProgressFill, 
                        { 
                          width: `${Math.min((volumeAtual / 900) * 100, 100)}%`,
                          backgroundColor: volumeAtual < 180 ? '#FF6B6B' : 
                                         volumeAtual < 450 ? '#FFA500' : '#29EBD5'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.waterProgressText}>
                    {Math.round((volumeAtual / 900) * 100)}%
                  </Text>
                </View>
              )}
              
              <View style={styles.garrafaInfoRow}>
                <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.garrafaInfoText}>Capacidade:</Text>
              </View>
              <Text style={styles.garrafaInfoValue}>900 mL</Text>
              <View style={{ flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {isConnected ? (
                  <>
                    <TouchableOpacity
                      style={styles.resincronizarButton}
                      onPress={disconnectDevice}
                    >
                      <MaterialCommunityIcons name="logout" size={18} color="#fff" />
                      <Text style={styles.resincronizarText}>Desconectar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.resincronizarButton, { backgroundColor: '#2196F3', marginTop: 8 }]}
                      onPress={async () => {
                        if (!connectedDevice?.id) {
                          console.log('❌ [SYNC] Erro: Nenhuma garrafa conectada');
                          Alert.alert("Erro", "Nenhuma garrafa conectada.");
                          return;
                        }
                        try {
                          console.log('🔄 [SYNC] Iniciando sincronização...');
                          console.log('📱 [SYNC] Garrafa ID:', connectedDevice.id);
                          console.log('👤 [SYNC] Usuário ID:', auth.currentUser?.uid);
                          await sincronizarCacheComBanco(connectedDevice.id);
                          console.log('✅ [SYNC] Sincronização concluída com sucesso!');
                          Alert.alert(
                            "Sucesso", 
                            "Leituras sincronizadas com sucesso!",
                            [{ text: "OK" }]
                          );
                        } catch (error: any) {
                          console.error('❌ [SYNC] Erro durante sincronização:', error);
                          console.error('❌ [SYNC] Stack trace:', error.stack);
                          Alert.alert(
                            "Erro", 
                            `Falha ao sincronizar: ${error.message || 'Erro desconhecido'}`,
                            [{ text: "OK" }]
                          );
                        }
                      }}
                      disabled={!isConnected}
                    >
                      <MaterialCommunityIcons name="cloud-upload" size={15} color="white" />
                      <Text style={styles.resincronizarText}>Sincronizar Leituras</Text>
                    </TouchableOpacity>
                  </>
                ) : (
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
                )}
              </View>
            </View>
          </View>
        </View>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="water" size={20} color="#082862" />
            <Text style={styles.cardTitle}>Total Ingerido</Text>
          </View>
          <Text style={styles.totalValue}>
            {consumoMensal >= 1000 
              ? `${(consumoMensal / 1000).toFixed(1)} L` 
              : `${consumoMensal} mL`}
          </Text>
          <Text style={styles.comparison}>
            {consumoMensalAnterior > 0
              ? `${Math.abs(consumoMensal - consumoMensalAnterior) >= 1000
                  ? `${(Math.abs(consumoMensal - consumoMensalAnterior) / 1000).toFixed(1)} L`
                  : `${Math.abs(consumoMensal - consumoMensalAnterior).toFixed(0)} mL`} ${consumoMensal >= consumoMensalAnterior ? 'mais' : 'menos'} que o mês passado`
              : 'Primeiro mês registrado'}
          </Text>
        </View>


        <View style={styles.chartContainer}>
          <BarChartComponent userData={profileData} />
        </View>


        <View style={styles.card}>
          <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons 
                name={config.enabled ? "bell-ring" : "bell-off"} 
                size={20} 
                color={config.enabled ? "#29EBD5" : "#999"} 
              />
              <Text style={styles.cardTitle}>Lembretes de Hidratação</Text>
            </View>
            <TouchableOpacity onPress={handleReminderSettings}>
              <MaterialCommunityIcons name="cog" size={20} color="#082862" />
            </TouchableOpacity>
          </View>

          {/* Status */}
          <View style={styles.reminderStatus}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.statusDot, { backgroundColor: config.enabled ? '#29EBD5' : '#999' }]} />
                <Text style={styles.statusText}>
                  {config.enabled ? 'Lembretes Ativos' : 'Lembretes Desativados'}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={handleToggleReminders}
                style={[styles.toggleButton, config.enabled && styles.toggleButtonActive]}
              >
                <Text style={[styles.toggleButtonText, config.enabled && styles.toggleButtonTextActive]}>
                  {config.enabled ? 'Desativar' : 'Ativar'}
                </Text>
              </TouchableOpacity>
            </View>

            {!hasPermission && (
              <View style={styles.warningBox}>
                <MaterialCommunityIcons name="alert-circle" size={16} color="#FF6B6B" />
                <Text style={styles.warningText}>
                  Permissão de notificação necessária
                </Text>
              </View>
            )}

            {config.enabled && hasPermission && (
              <>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    {config.startHour}h - {config.endHour}h, a cada{' '}
                    {config.intervalMinutes >= 60 
                      ? `${Math.floor(config.intervalMinutes / 60)}h` 
                      : `${config.intervalMinutes}min`}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar-check" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    {scheduledCount} lembretes agendados
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Próximos Horários */}
          {config.enabled && nextReminders.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.reminderSubtitle}>Próximos Horários</Text>
              <View style={styles.timeOptions}>
                {nextReminders.map((time, idx) => (
                  <View key={idx} style={styles.timeOption}>
                    <View style={styles.timeCircle} />
                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Ação */}
          {!config.enabled && (
            <TouchableOpacity 
              style={styles.configureButton}
              onPress={handleReminderSettings}
            >
              <MaterialCommunityIcons name="cog-outline" size={18} color="#082862" />
              <Text style={styles.configureButtonText}>
                Configurar Lembretes
              </Text>
            </TouchableOpacity>
          )}
        </View>


        {/* <View style={styles.card}>
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
        </View> */}

  
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
  intervalChip: {
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.03,
    borderRadius: 16,
    backgroundColor: '#ECEFF1',
  },
  intervalChipActive: {
    backgroundColor: '#082862',
  },
  intervalChipText: {
    color: '#082862',
    fontWeight: '600',
  },
  intervalChipTextActive: {
    color: '#FFFFFF',
  },
  reminderStatus: {
    paddingVertical: height * 0.01,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: Math.round(width * 0.038),
    color: '#333',
    fontWeight: '500',
  },
  toggleButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  toggleButtonActive: {
    backgroundColor: '#082862',
    borderColor: '#082862',
  },
  toggleButtonText: {
    fontSize: Math.round(width * 0.032),
    color: '#1976D2',
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: width * 0.03,
    borderRadius: 8,
    marginTop: height * 0.01,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  warningText: {
    fontSize: Math.round(width * 0.032),
    color: '#E65100',
    marginLeft: width * 0.02,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  infoText: {
    fontSize: Math.round(width * 0.035),
    color: '#666',
    marginLeft: width * 0.02,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: height * 0.015,
  },
  configureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    marginTop: height * 0.01,
  },
  configureButtonText: {
    fontSize: Math.round(width * 0.038),
    color: '#082862',
    fontWeight: '600',
    marginLeft: width * 0.02,
  },
  waterProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.04,
    marginTop: height * 0.008,
    marginBottom: height * 0.015,
  },
  waterProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: width * 0.02,
  },
  waterProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  waterProgressText: {
    fontSize: Math.round(width * 0.032),
    fontWeight: '600',
    color: '#666',
    minWidth: width * 0.1,
    textAlign: 'right',
  },
});
