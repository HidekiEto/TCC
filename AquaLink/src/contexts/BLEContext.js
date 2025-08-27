import React, { createContext, useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export const BLEContext = createContext({});

export const BLEProvider = ({ children }) => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissions();
    }

    return () => {
      manager.destroy();
    };
  }, [manager]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  };

  const scanDevices = () => {
    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }

      // Filtra dispositivos pelo nome ou UUID
      if (device.name && device.name.includes('ESP32')) {
        setDevices((prevDevices) => {
          const exists = prevDevices.find((d) => d.id === device.id);
          if (!exists) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Para o scan após 10 segundos
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  const connectToDevice = async (device) => {
    try {
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connectedDevice);
      console.log('Conectado ao dispositivo:', connectedDevice.name);
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      console.log('Dispositivo desconectado');
    }
  };

  return (
    <BLEContext.Provider
      value={{
        devices,
        connectedDevice,
        scanDevices,
        connectToDevice,
        disconnectDevice,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};
