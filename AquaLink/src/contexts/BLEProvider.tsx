import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

interface BLEContextType {
  isScanning: boolean;
  isConnected: boolean;
  scanForDevices: () => void;
  connectToDevice: () => void;
  disconnectDevice: () => void;
}

const BLEContext = createContext<BLEContextType | undefined>(undefined);

interface BLEProviderProps {
  children: ReactNode;
}

export const BLEProvider: React.FC<BLEProviderProps> = ({ children }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const scanForDevices = () => {
    setIsScanning(true);
    console.log('Iniciando scan para dispositivos...');
    
    // Simular scan por 3 segundos
    setTimeout(() => {
      setIsScanning(false);
      console.log('Scan concluído');
    }, 3000);
  };

  const connectToDevice = () => {
    console.log('Conectando ao dispositivo...');
    setIsConnected(true);
    Alert.alert('Sucesso', 'Conectado ao dispositivo AquaLink');
  };

  const disconnectDevice = () => {
    console.log('Desconectando dispositivo...');
    setIsConnected(false);
    Alert.alert('Info', 'Dispositivo desconectado');
  };

  const value: BLEContextType = {
    isScanning,
    isConnected,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
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
