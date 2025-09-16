import React, { useCallback } from "react";
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BarChartComponent } from "../components/DashboardComponents/BarChart";
import { useBLE } from "../contexts/BLEProvider";
import { useState } from "react";


export default function Dashboard() {
  const { scanForDevices, isScanning, isConnected, connectedDevice, foundDevices, connectToDevice, disconnectDevice } = useBLE();
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
            <Text style={styles.periodText}> Últimos 30 dias </Text>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </Text>
        </View>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="water" size={20} color="#082862" />
            <Text style={styles.cardTitle}>Total Ingerido</Text>
          </View>
          <Text style={styles.totalValue}>37.396 mL</Text>
          <Text style={styles.comparison}>24,5 mL mais que passado</Text>
        </View>


        <View style={styles.chartContainer}>
          <BarChartComponent />
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
          <Text style={styles.garrafaSubtitle}>AquaLink Classic</Text>

          <View style={styles.garrafaContent}>
            <View style={styles.bottleImageContainer}>
              <Image
                source={require('../assets/bottle.png')}
                style={styles.bottleImage}
                resizeMode="contain"
              />
              <Text style={styles.cadastradaText}>Cadastrada em: 28/08/2025</Text>
            </View>

            <View style={styles.garrafaInfo}>
              <View style={styles.garrafaInfoRow}>
                <View style={styles.statusIndicator} />
                <Text style={styles.garrafaInfoText}>Bateria: 87%</Text>
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
                  style={[styles.resincronizarButton, { backgroundColor: '#F44336' }]}
                  onPress={disconnectDevice}
                  disabled={!isConnected}
                >
                  <MaterialCommunityIcons name="bluetooth-off" size={16} color="white" />
                  <Text style={styles.resincronizarText}>Desconectar</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '200',
    color: '#666',
  },
  dashboardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  dashboardText: {
    fontSize: 16,
    fontWeight: '200',
    marginLeft: 8,
    color: '#333',
  },
  dashboardSubtext: {
    fontWeight: '400',
  },
  periodText: {
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
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
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#082862',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#082862',
    textAlign: 'center',
    marginVertical: 8,
  },
  comparison: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
    marginVertical: 8,
  },
  nextReminder: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  reminderSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#29EBD5',
    marginRight: 6,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  calculationTime: {
    fontSize: 14,
    color: '#666',
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  batteryInfo: {
    marginBottom: 16,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  batteryText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#4CAF50',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  capacityText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#29EBD5',
  },
  capacityValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  capacityAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#082862',
  },
  bottleImageContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  bottleImage: {
    width: 160,
    height: 120,
  },
  garrafaSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#082862',
    marginBottom: 16,
  },
  garrafaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cadastradaText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  garrafaInfo: {
    flex: 1,
    marginLeft: 20,
  },
  garrafaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#082862',
    marginRight: 8,
  },
  garrafaInfoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  garrafaInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#082862',
    marginLeft: 16,
    marginBottom: 8,
  },
  resincronizarButton: {
    backgroundColor: '#082862',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  resincronizarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  infoCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  infoImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  infoLink: {
    fontSize: 12,
    color: '#29EBD5',
  },
  bottomSpace: {
    height: 100,
  },

});
