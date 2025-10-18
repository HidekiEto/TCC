import React, { createContext, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../config/firebase";
import { ref, push, set, get, child } from "firebase/database";
import { auth } from "../config/firebase";
import dayjs from "dayjs";

interface DbContextType {
  salvarLeituraNoCache: (leitura: any) => Promise<void>;
  sincronizarCacheComBanco: (bottleId: string) => Promise<void>;
  getConsumoAcumuladoNoCache: () => Promise<number>;
  getConsumoAcumuladoDoDia: () => Promise<number>;
  adicionarLeituraSimulada: (consumo: number) => Promise<void>;
}

export const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const adicionarLeituraSimulada = useCallback(async (consumo: number) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Usuário não autenticado');
      const cacheKey = `leiturasCache_${uid}`;
      const novaLeitura = {
        consumo,
        timestamp: new Date().toISOString(),
      };
      const cache = await AsyncStorage.getItem(cacheKey);
      let leituras = cache ? JSON.parse(cache) : [];
      leituras.push(novaLeitura);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(leituras));
      console.log('Leitura simulada adicionada:', novaLeitura);
    } catch (e) {
      console.log('Erro ao adicionar leitura simulada:', e);
    }
  }, []);
 
  const salvarLeituraNoCache = useCallback(async (leitura: any) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Usuário não autenticado');
      const cacheKey = `leiturasCache_${uid}`;
      const cache = await AsyncStorage.getItem(cacheKey);
      let leituras = cache ? JSON.parse(cache) : [];
      leituras.push(leitura);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(leituras));
      console.log("Leitura salva no cache local.");
    } catch (e) {
      console.log("Erro ao salvar leitura no cache:", e);
    }
  }, []);

  const getConsumoAcumuladoNoCache = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return 0;
    const cacheKey = `leiturasCache_${uid}`;
    const cache = await AsyncStorage.getItem(cacheKey);
    let leituras = cache ? JSON.parse(cache) : [];
    let soma = 0;
    for (const leitura of leituras) {
      if (typeof leitura.consumo === "number") {
        soma += leitura.consumo;
      }
    }
    return soma;
  }, []);

  const getConnectedBottleId = async (uid: string) => {
  const userRef = ref(db, `users/${uid}/connectedBottle`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : null;
};

  const getConsumoAcumuladoDoDia = useCallback(async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return 0;
  const bottleId = await getConnectedBottleId(uid);
  if (!bottleId) return 0;
  const hoje = dayjs().format("YYYY-MM-DD");
  const acumuladoRef = ref(db, `bottles/${bottleId}/readings/consumoAcumulado/${hoje}`);
  const snapshot = await get(acumuladoRef);
  return snapshot.exists() ? snapshot.val() : 0;
}, []);



  const sincronizarCacheComBanco = useCallback(async () => {
  try {
    console.log('🔄 [DbContext] Iniciando sincronização do cache com banco...');
    console.log('🕐 [DbContext] Timestamp:', new Date().toLocaleString('pt-BR'));
    
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log("❌ [DbContext] Erro: Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }
    
    console.log(`👤 [DbContext] UID do usuário: ${uid}`);
    
    const cacheKey = `leiturasCache_${uid}`;
    const cache = await AsyncStorage.getItem(cacheKey);
    let leituras = cache ? JSON.parse(cache) : [];
    
    console.log(`📦 [DbContext] Leituras encontradas no cache: ${leituras.length}`);
    
    if (leituras.length === 0) {
      console.log('⚠️ [DbContext] Nenhuma leitura no cache para sincronizar');
      return;
    }
    
    const bottleId = await getConnectedBottleId(uid);

    if (!bottleId) {
      console.log("❌ [DbContext] Erro: Nenhuma garrafa conectada ao usuário");
      throw new Error("Nenhuma garrafa conectada ao usuário");
    }
    
    console.log(`🍾 [DbContext] Garrafa conectada: ${bottleId}`);

    const consumoPorDia: Record<string, number> = {};
    console.log('📝 [DbContext] Processando leituras...');
    
    for (const leitura of leituras) {
      if (typeof leitura.consumo === "number" && leitura.timestamp) {
        const dia = dayjs(leitura.timestamp).format("YYYY-MM-DD");
        consumoPorDia[dia] = (consumoPorDia[dia] || 0) + leitura.consumo;
        console.log(`  ➡️ Leitura: ${leitura.consumo}ml em ${dia}`);
      }
      
      await push(ref(db, `bottles/${bottleId}/readings`), leitura);
    }
    
    console.log(`📊 [DbContext] Dias processados: ${Object.keys(consumoPorDia).length}`);

    console.log('💾 [DbContext] Atualizando consumo acumulado por dia...');
    for (const dia in consumoPorDia) {
      const acumuladoRef = ref(db, `bottles/${bottleId}/readings/consumoAcumulado/${dia}`);
      const snapshot = await get(acumuladoRef);
      const valorAtual = snapshot.exists() ? snapshot.val() : 0;
      const novoValor = valorAtual + consumoPorDia[dia];
      const valorArredondado = Math.round(novoValor * 10) / 10;
      
      console.log(`  📅 ${dia}: ${valorAtual}ml + ${consumoPorDia[dia]}ml = ${valorArredondado}ml`);
      await set(acumuladoRef, valorArredondado);
    }

    console.log('🔗 [DbContext] Vinculando usuário à garrafa...');
    await set(ref(db, `bottles/${bottleId}/connectedUser`), uid);

    console.log('🗑️ [DbContext] Limpando cache local...');
    await AsyncStorage.removeItem(cacheKey);
    
    const syncTimestamp = new Date().toISOString();
    await AsyncStorage.setItem('lastSyncTimestamp', syncTimestamp);
    console.log('⏰ [DbContext] Timestamp de sincronização salvo:', syncTimestamp);
    
    console.log("✅ [DbContext] Sincronização concluída com sucesso!");
    console.log(`📈 [DbContext] Resumo: ${leituras.length} leituras em ${Object.keys(consumoPorDia).length} dias diferentes`);
    console.log('🕐 [DbContext] Concluído em:', new Date().toLocaleString('pt-BR'));
    
  } catch (e: any) {
    console.error("❌ [DbContext] Erro ao sincronizar leituras:", e);
    console.error("❌ [DbContext] Detalhes do erro:", e.message);
    console.error("❌ [DbContext] Stack:", e.stack);
    throw e; 
  }
}, []);

  return (
  <DbContext.Provider value={{ salvarLeituraNoCache, sincronizarCacheComBanco, getConsumoAcumuladoNoCache, getConsumoAcumuladoDoDia, adicionarLeituraSimulada }}>
      {children}
    </DbContext.Provider>
  );
};