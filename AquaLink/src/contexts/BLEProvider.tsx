import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { useFocusEffect } from '@react-navigation/native';
import { useDataContext } from '../hooks/useDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDbContext } from '../hooks/useDbContext';
import { auth } from '../config/firebase';

const SERVICE_UUID = "34303c72-4cb1-4d48-98cb-781afece9cd7";
const CHARACTERISTIC_UUID = "5b4ff54f-8297-45b4-9949-7ff95e672aae";

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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(`🔄 [BLEProvider] Usuário logado: ${user.uid}`);
        
        try {
          if (dbContext) {
            const consumoCache = await dbContext.getConsumoAcumuladoNoCache();
            consumoAcumuladoRef.current = consumoCache;
            if (dataContext) {
              dataContext.setConsumoAcumulado(consumoCache);
            }
            console.log("✅ [BLEProvider] Consumo do usuário carregado:", consumoCache, "mL");
          }
        } catch (e) {
          console.log("⚠️ [BLEProvider] Erro ao carregar consumo:", e);
        }
      } else {
        console.log(`🚪 [BLEProvider] Usuário deslogado - resetando refs`);
        
        volumeAnteriorRef.current = null;
        consumoAcumuladoRef.current = 0;
      }
    });
    
    return () => unsubscribe();
  }, [dbContext, dataContext]);

  useEffect(() => {
    const tryReconnect = async () => {
      const lastDeviceId = await AsyncStorage.getItem('lastDeviceId');
      if (lastDeviceId) {
        console.log(`🔄 [BLE] Tentando reconectar automaticamente ao dispositivo ${lastDeviceId}...`);
        try {
          await connectToDevice(lastDeviceId);
        } catch (e) {
          console.log(`ℹ️ [BLE] Reconexão automática falhou. O app funcionará sem conexão BLE.`);
          setIsConnected(false);
          setConnectedDevice(null);
        }
      } else {
        console.log(`ℹ️ [BLE] Nenhum dispositivo salvo para reconexão automática.`);
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

  useEffect(() => {
    if (!isConnected || !connectedDevice?.id || !dbContext) return;

    console.log("🔄 [AUTO-SYNC] Sistema de sincronização automática iniciado");
    console.log("🔄 [AUTO-SYNC] Intervalo: 5 minutos");
    console.log("🔄 [AUTO-SYNC] Garrafa conectada:", connectedDevice.id);

    const syncInterval = setInterval(async () => {
      try {
        console.log("⏰ [AUTO-SYNC] Verificando se há leituras para sincronizar...");
        
        const uid = auth.currentUser?.uid;
        if (!uid) {
          console.log("⚠️ [AUTO-SYNC] Usuário não autenticado, pulando sincronização");
          return;
        }

        const cacheKey = `leiturasCache_${uid}`;
        const cache = await AsyncStorage.getItem(cacheKey);
        const leituras = cache ? JSON.parse(cache) : [];

        if (leituras.length === 0) {
          console.log("ℹ️ [AUTO-SYNC] Nenhuma leitura no cache para sincronizar");
          return;
        }

        console.log(`🔄 [AUTO-SYNC] Iniciando sincronização automática de ${leituras.length} leitura(s)...`);
        console.log(`📱 [AUTO-SYNC] Garrafa ID: ${connectedDevice.id}`);
        console.log(`👤 [AUTO-SYNC] Usuário ID: ${uid}`);

        await dbContext.sincronizarCacheComBanco(connectedDevice.id);

        console.log("✅ [AUTO-SYNC] Sincronização automática concluída com sucesso!");
        console.log(`📊 [AUTO-SYNC] ${leituras.length} leitura(s) enviada(s) para o Firebase`);
        
      } catch (error: any) {
        console.error("❌ [AUTO-SYNC] Erro durante sincronização automática:", error?.message || error);
        console.error("❌ [AUTO-SYNC] Stack:", error?.stack);
      }
    }, 5 * 60 * 1000); // 5 minutos

    const initialSyncTimeout = setTimeout(async () => {
      try {
        console.log("🚀 [AUTO-SYNC] Executando sincronização inicial...");
        
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const cacheKey = `leiturasCache_${uid}`;
        const cache = await AsyncStorage.getItem(cacheKey);
        const leituras = cache ? JSON.parse(cache) : [];

        if (leituras.length > 0) {
          console.log(`🔄 [AUTO-SYNC] Sincronizando ${leituras.length} leitura(s) pendente(s)...`);
          await dbContext.sincronizarCacheComBanco(connectedDevice.id);
          console.log("✅ [AUTO-SYNC] Sincronização inicial concluída!");
        } else {
          console.log("ℹ️ [AUTO-SYNC] Nenhuma leitura pendente na sincronização inicial");
        }
      } catch (error: any) {
        console.error("❌ [AUTO-SYNC] Erro na sincronização inicial:", error?.message || error);
      }
    }, 30000); // 30 segundos após conectar

    return () => {
      console.log("🛑 [AUTO-SYNC] Sistema de sincronização automática encerrado");
      clearInterval(syncInterval);
      clearTimeout(initialSyncTimeout);
    };
  }, [isConnected, connectedDevice, dbContext]);



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


    if (scanTimeout.current) clearTimeout(scanTimeout.current);
    scanTimeout.current = setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const connectToDevice = async (deviceId: string, tentativa = 1) => {
    setIsScanning(false);
    bleManager.stopDeviceScan();

    console.log(`🔄 [BLE] Tentando conectar ao dispositivo ${deviceId} (tentativa ${tentativa}/3)...`);

    try {
      const device = await bleManager.connectToDevice(deviceId, { 
        timeout: 8000 // 8 segundos de timeout
      });

      console.log(`✅ [BLE] Dispositivo conectado com sucesso: ${device.name || device.id}`);

      await device.requestMTU(517);
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);
      setIsConnected(true);

      device.onDisconnected((error, disconnectedDevice) => {
        console.log("🔌 [BLE] Dispositivo desconectado", error);
        setIsConnected(false);
        setConnectedDevice(null);
        console.log("ℹ️ [BLE] A garrafa foi desconectada. O app continuará funcionando normalmente.");
      });

      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.log("⚠️ [BLE] Erro ao monitorar notify:", error);
            return;
          }
          if (characteristic?.value) {
            const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
            console.log("📡 [BLE] Notify recebido da garrafa:", decoded);

            try {
              if (decoded.trim().startsWith("{")) {
                const data = JSON.parse(decoded);
                
                const volume = typeof data.volume === "number" ? data.volume : null;
                const distancia = typeof data.distancia === "number" ? data.distancia : null;
                const batteryV = typeof data.bateria_v === "number" ? data.bateria_v : null;
                const batteryPct = typeof data.bateria_pct === "number" ? data.bateria_pct : null;
                const ldrPct = typeof data.ldr_pct === "number" ? data.ldr_pct : null;

                if (batteryPct !== null) {
                  setBatteryLevel(Math.round(batteryPct)); 
                  console.log("🔋 Bateria:", batteryPct, "% | Tensão:", batteryV, "V");
                }

                if (dataContext) {
                  if (distancia !== null) dataContext.setDistancia(distancia);
                  if (batteryV !== null) dataContext.setBatteryV(batteryV);
                  if (batteryPct !== null) dataContext.setBatteryPct(batteryPct);
                  if (ldrPct !== null) dataContext.setLdrPct(ldrPct);

                  if (volume !== null) {
                    if (volumeAnteriorRef.current !== null) {
                      dataContext.setVolumeAnterior(volumeAnteriorRef.current);
                      let consumo = volumeAnteriorRef.current - volume;

                      if (consumo < 0) {
                        console.log("⚠️ Consumo negativo detectado, ajustando para 0");
                        consumo = 0;
                      }

                      consumo = Math.round(consumo * 10) / 10;
                      dataContext.setConsumo(consumo);
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
                      console.log("📏 Distância:", distancia, "cm");
                      console.log("💧 Volume anterior:", volumeAnteriorRef.current, "mL");
                      console.log("💧 Volume atual:", volume, "mL");
                      console.log("📊 Consumo calculado:", consumo, "mL");
                      console.log("🔋 Bateria:", batteryPct, "% (", batteryV, "V)");
                      console.log("☀️ LDR:", ldrPct, "%");
                      console.log("=================================");
                    } else {
                      dataContext.setVolumeAnterior(volume);
                      dataContext.setConsumo(0);
                      consumoAcumuladoRef.current = 0;
                      dataContext.setConsumoAcumulado(0); 
                      console.log("🆕 Primeira leitura: volume anterior inicializado como o volume recebido.");

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
                }
              } else {
                console.log("📨 [BLE] Mensagem recebida:", decoded);
              }
            } catch (e) {
              console.log("❌ [BLE] Erro ao processar notify:", e);
            }
          }
        }
      );

      try {
        const uid = auth.currentUser?.uid;
        if (uid && device.id) {
          const { ref, set } = await import('firebase/database');
          const { db } = await import('../config/firebase');
          
          await set(ref(db, `users/${uid}/connectedBottle`), device.id);
          console.log(`🔗 [BLE] Usuário ${uid} vinculado à garrafa ${device.id} no Firebase`);
          
          await AsyncStorage.setItem('lastDeviceId', device.id);
          console.log(`💾 [BLE] Device ID salvo no AsyncStorage`);
        }
      } catch (e) {
        console.error("⚠️ [BLE] Erro ao vincular usuário à garrafa no Firebase:", e);
      }

      Alert.alert('Sucesso', `Conectado ao dispositivo ${device.name || device.id}`);
      
    } catch (error: any) {
      console.log(`⚠️ [BLE] Falha na conexão (tentativa ${tentativa}/3):`, error.message);
      
      setIsConnected(false);
      setConnectedDevice(null);

      // Tentar novamente se ainda houver tentativas
      if (tentativa < 3) {
        try {
          await bleManager.cancelDeviceConnection(deviceId);
        } catch (e) {
          // Ignora erro ao cancelar conexão
        }
        console.log(`🔄 [BLE] Aguardando 2 segundos antes de tentar novamente...`);
        setTimeout(() => connectToDevice(deviceId, tentativa + 1), 2000);
      } else {
        // Após 3 tentativas, apenas informa mas não bloqueia o app
        console.log(`ℹ️ [BLE] Não foi possível conectar após ${tentativa} tentativas. O app funcionará sem conexão BLE.`);
        Alert.alert(
          'Conexão BLE', 
          'Não foi possível conectar à garrafa. O aplicativo continuará funcionando normalmente.',
          [{ text: 'OK' }]
        );
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