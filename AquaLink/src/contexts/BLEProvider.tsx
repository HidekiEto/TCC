import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-ab12-cd34-ef56-1234567890ab";

interface BLEContextType {
  isScanning: boolean;
  isConnected: boolean;
  scanForDevices: () => void;
  connectToDevice: (deviceId: string) => void;
  disconnectDevice: () => void;
  foundDevices: Device[];
  connectedDevice: Device | null;
  writeToDevice: (data: string) => Promise<void>;
}

const BLEContext = createContext<BLEContextType | undefined>(undefined);

interface BLEProviderProps {
  children: ReactNode;
}

const bleManager = new BleManager();

async function requestAndroidPermissions() {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ]);
  return (
    granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
    granted['android.permission.BLUETOOTH_SCAN'] === 'granted'
  );
}

export const BLEProvider: React.FC<BLEProviderProps> = ({ children }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [foundDevices, setFoundDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const writeToDevice = async (data: string) => {
    if (!connectedDevice) {
      Alert.alert('Erro', 'Nenhum dispositivo conectado');
      return;
    }
    try {
      const base64data = Buffer.from(data, 'utf-8').toString('base64');
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64data
      );
      console.log("Comando enviado via BLE:", data);
    } catch (error) {
      console.log("Erro ao enviar comando BLE:", error);
      Alert.alert('Erro', 'Falha ao enviar comando BLE');
    }
  };

  const scanForDevices = async () => {
    setFoundDevices([]);
    setIsScanning(true);

    const ok = await requestAndroidPermissions();
    if (!ok) {
      Alert.alert('Permissão Bluetooth não concedida');
      setIsScanning(false);
      return;
    }

    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        console.log('Scan callback:', { error, device });
        if (error) {
          Alert.alert('Erro no scan', error.message);
          setIsScanning(false);
          bleManager.stopDeviceScan();
          return;
        }
        if (device) {
          setFoundDevices((prev) => {
            if (prev.find((d) => d.id === device.id)) return prev;
            return [...prev, device];
          });
        }
      }

    );

    // Para o scan após 10 segundos
    if (scanTimeout.current) clearTimeout(scanTimeout.current);
    scanTimeout.current = setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      setIsScanning(false);
    bleManager.stopDeviceScan();
    const device = await bleManager.connectToDevice(deviceId);

    await device.requestMTU(517);

    await device.discoverAllServicesAndCharacteristics();
    setConnectedDevice(device);
    setIsConnected(true);

    // Listener de desconexão BLE em tempo real
    device.onDisconnected((error, disconnectedDevice) => {
      console.log("BLE desconectado!", error);
      setIsConnected(false);
      setConnectedDevice(null);
      Alert.alert('Info', 'A garrafa foi desconectada!');
    });

      
      // Monitorar notificações
      device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.log("Erro ao monitorar notify:", error);
          return;
        }
        if (characteristic?.value) {
          const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
          console.log("Notify recebido da garrafa:", decoded);
        }
      }
    );

      Alert.alert('Sucesso', `Conectado ao dispositivo ${device.name || device.id}`);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao conectar');
      setIsConnected(false);
      setConnectedDevice(null);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
      } catch { }
    }
    setIsConnected(false);
    setConnectedDevice(null);
    Alert.alert('Info', 'Dispositivo desconectado');
  };

  const value: BLEContextType = {
    isScanning,
    isConnected,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    foundDevices,
    connectedDevice,
    writeToDevice,
  };

  return <BLEContext.Provider value={value}>{children}</BLEContext.Provider>;
};

export const useBLE = (): BLEContextType => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useBLE deve ser usado dentro de um BLEProvider');
  }
  return context;
};

export default BLEProvider;