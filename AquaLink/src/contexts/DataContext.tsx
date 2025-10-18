import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface DataContextType {
  volume: number | null;
  volumeAnterior: number | null;
  consumo: number | null;
  consumoAcumulado: number | null;
  distancia: number | null;
  batteryV: number | null;
  batteryPct: number | null;
  ldrPct: number | null;
  setVolume: (v: number) => void;
  setVolumeAnterior: (v: number) => void;
  setConsumo: (c: number) => void;
  setConsumoAcumulado: (c: number) => void;
  setDistancia: (d: number) => void;
  setBatteryV: (v: number) => void;
  setBatteryPct: (p: number) => void;
  setLdrPct: (l: number) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [volume, setVolume] = useState<number | null>(null);
  const [volumeAnterior, setVolumeAnterior] = useState<number | null>(null);
  const [consumo, setConsumo] = useState<number | null>(null);
  const [consumoAcumulado, setConsumoAcumulado] = useState<number>(0);
  const [distancia, setDistancia] = useState<number | null>(null);
  const [batteryV, setBatteryV] = useState<number | null>(null);
  const [batteryPct, setBatteryPct] = useState<number | null>(null);
  const [ldrPct, setLdrPct] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const newUserId = user?.uid || null;
 
      if (newUserId !== currentUserId) {
        console.log(`🔄 [DataContext] Mudança de usuário detectada`);
        console.log(`   Usuário anterior: ${currentUserId || 'nenhum'}`);
        console.log(`   Novo usuário: ${newUserId || 'nenhum'}`);
        

        setVolume(null);
        setVolumeAnterior(null);
        setConsumo(null);
        setConsumoAcumulado(0);
        setDistancia(null);
        setBatteryV(null);
        setBatteryPct(null);
        setLdrPct(null);
        
    
        setCurrentUserId(newUserId);
        
        if (newUserId) {
          console.log(`📥 [DataContext] Carregando dados do usuário ${newUserId}`);
          await carregarDadosDoUsuario(newUserId);
        } else {
          console.log(`🚪 [DataContext] Usuário deslogado, dados resetados`);
        }
      }
    });
    
    return () => unsubscribe();
  }, [currentUserId]);


  const carregarDadosDoUsuario = async (uid: string) => {
    try {
      const cacheKey = `leiturasCache_${uid}`;
      const cache = await AsyncStorage.getItem(cacheKey);
      const leituras = cache ? JSON.parse(cache) : [];
      
      let soma = 0;
      for (const leitura of leituras) {
        if (typeof leitura.consumo === "number") {
          soma += leitura.consumo;
        }
      }
      
      setConsumoAcumulado(soma);
      console.log(`✅ [DataContext] Consumo acumulado do usuário ${uid}: ${soma} mL`);
      console.log(`📊 [DataContext] Total de leituras no cache: ${leituras.length}`);
    } catch (e) {
      console.log("⚠️ [DataContext] Erro ao carregar dados do usuário:", e);
    }
  };

  return (
    <DataContext.Provider value={{ 
      volume, setVolume, 
      volumeAnterior, setVolumeAnterior, 
      consumo, setConsumo, 
      consumoAcumulado, setConsumoAcumulado,
      distancia, setDistancia,
      batteryV, setBatteryV,
      batteryPct, setBatteryPct,
      ldrPct, setLdrPct
    }}>
      {children}
    </DataContext.Provider>
  );
};