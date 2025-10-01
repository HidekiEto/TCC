import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { useFocusEffect } from '@react-navigation/native';
import { useDataContext } from '../hooks/useDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDbContext } from '../hooks/useDbContext';

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
  batteryLevel: number | null; 
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
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null); 

  const dataContext = useDataContext();
  const dbContext = useDbContext();


  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeAnteriorRef = useRef<number | null>(null);
  const consumoAcumuladoRef = useRef<number>(0);


  useEffect(() => {
    const tryReconnect = async () => {
      const lastDeviceId = await AsyncStorage.getItem('lastDeviceId');
      if (lastDeviceId) {
        try {
          await connectToDevice(lastDeviceId);
        } catch (e) {
          // Se não conseguir conectar, limpe o estado
          setIsConnected(false);
          setConnectedDevice(null);
        }
      }
    };
    tryReconnect();
  }, []);

  useEffect(() => {
    if (!connectedDevice) return;
    const interval = setInterval(() => {
      bleManager.isDeviceConnected(connectedDevice.id).then((connected) => {
        if (!connected) {
          setIsConnected(false);
          setConnectedDevice(null);
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [connectedDevice]);



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

  const connectToDevice = async (deviceId: string, tentativa = 1) => {
  setIsScanning(false);
  bleManager.stopDeviceScan();

  let timeoutId: NodeJS.Timeout | null = null;
  let connected = false;

  try {
    await new Promise<void>((resolve, reject) => {
      timeoutId = setTimeout(() => {
        if (!connected) {
          reject(new Error("Timeout na conexão BLE. Tentando novamente..."));
        }
      }, 3000); // 3 segundos de timeout

      bleManager.connectToDevice(deviceId)
        .then(async (device) => {
          connected = true;
          if (timeoutId) clearTimeout(timeoutId);

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

                try {
                  if (decoded.trim().startsWith("{")) {
                    const data = JSON.parse(decoded);
                    const volume = typeof data.volume === "number" ? data.volume : null;
                    const battery = typeof data.battery === "number" ? data.battery : null; // NOVO

                    if (battery !== null) {
                      setBatteryLevel(battery); // NOVO
                      console.log("Nível da bateria recebido:", battery);
                    }

                    if (dataContext && volume !== null) {
                      if (volumeAnteriorRef.current !== null) {
                        dataContext.setVolumeAnterior(volumeAnteriorRef.current);
                        let consumo = volumeAnteriorRef.current - volume;

                        if (consumo < 0) {
                          console.log("Consumo negativo detectado, ajustando para 0");
                          consumo = 0;
                        }

                        consumo = Math.round(consumo * 10) / 10;
                        dataContext.setConsumo(consumo);

                        // Calcule o novo acumulado usando a ref local
                        consumoAcumuladoRef.current = Math.round((consumoAcumuladoRef.current + (consumo > 0 ? consumo : 0)) * 10) / 10;
                        dataContext.setConsumoAcumulado(consumoAcumuladoRef.current);

                        if (dbContext) {
                          const leitura = {
                            timestamp: Date.now(),
                            volume,
                            volumeAnterior: volumeAnteriorRef.current,
                            consumo,
                          };
                          dbContext.salvarLeituraNoCache(leitura);
                        }

                        console.log("==== DADOS ATUALIZADOS ====");
                        console.log("Volume anterior:", volumeAnteriorRef.current);
                        console.log("Volume atual:", volume);
                        console.log("Consumo calculado:", consumo);             
                        console.log("=================================");
                      } else {
                        dataContext.setVolumeAnterior(volume);
                        dataContext.setConsumo(0);
                        consumoAcumuladoRef.current = 0;
                        dataContext.setConsumoAcumulado(0); // Zera o acumulado na primeira leitura
                        console.log("Primeira leitura: volume anterior inicializado como o volume recebido.");

                        if (dbContext) {
                          const leitura = {
                            timestamp: Date.now(),
                            volume,
                            volumeAnterior: volume,
                            consumo: 0,
                            consumoAcumulado: 0,
                          };
                          dbContext.salvarLeituraNoCache(leitura);
                        }
                      }

                      volumeAnteriorRef.current = volume;
                      dataContext.setVolume(volume);
                    }
                  } else {
                    console.log("Mensagem recebida:", decoded);
                  }
                } catch (e) {
                  console.log("Erro ao processar notify:", e);
                }
              }
            }
          );

          Alert.alert('Sucesso', `Conectado ao dispositivo ${device.name || device.id}`);
          resolve();
        })
        .catch((error) => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(error);
        });
    });
  } catch (error: any) {
    setIsConnected(false);
    setConnectedDevice(null);
    Alert.alert('Erro', error.message || 'Erro ao conectar');

    // Tenta de novo automaticamente após pequeno delay
    if (tentativa < 2) {
  try {
    await bleManager.cancelDeviceConnection(deviceId);
  } catch (e) {
    // Ignora erro se já estiver desconectado
  }
  setTimeout(() => connectToDevice(deviceId, tentativa + 1), 2000); // 2 segundos de delay
}
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
    batteryLevel,
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