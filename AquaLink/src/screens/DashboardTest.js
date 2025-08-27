import React, { useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { BLEContext } from '../contexts/BLEContext';

const DashboardTest = () => {
  const {
    devices,
    connectedDevice,
    scanDevices,
    connectToDevice,
    disconnectDevice,
  } = useContext(BLEContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conexão BLE com ESP-32</Text>
      {connectedDevice ? (
        <View>
          <Text>Conectado a: {connectedDevice.name}</Text>
          <Button title="Desconectar" onPress={disconnectDevice} />
        </View>
      ) : (
        <View>
          <Button title="Escanear Dispositivos" onPress={scanDevices} />
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.device}>
                <Text>{item.name}</Text>
                <Button title="Conectar" onPress={() => connectToDevice(item)} />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  device: {
    marginBottom: 10,
  },
});

export default DashboardTest;