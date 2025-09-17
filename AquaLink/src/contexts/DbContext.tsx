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
}

export const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  // Salva uma leitura no cache local
  const salvarLeituraNoCache = useCallback(async (leitura: any) => {
    try {
      const cache = await AsyncStorage.getItem('leiturasCache');
      let leituras = cache ? JSON.parse(cache) : [];
      leituras.push(leitura);
      await AsyncStorage.setItem('leiturasCache', JSON.stringify(leituras));
      console.log("Leitura salva no cache local.");
    } catch (e) {
      console.log("Erro ao salvar leitura no cache:", e);
    }
  }, []);

  const getConsumoAcumuladoNoCache = useCallback(async () => {
    const cache = await AsyncStorage.getItem('leiturasCache');
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



  // Sincroniza o cache com o Firestore e limpa o cache se sucesso
  const sincronizarCacheComBanco = useCallback(async () => {
  try {
    const cache = await AsyncStorage.getItem('leiturasCache');
    let leituras = cache ? JSON.parse(cache) : [];
    if (leituras.length === 0) return;

    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log("Usuário não autenticado.");
      return;
    }
    const bottleId = await getConnectedBottleId(uid);

    if (!bottleId) {
      console.log("Nenhuma garrafa conectada ao usuário.");
      return;
    }

    // Agrupa consumos por data
    const consumoPorDia: Record<string, number> = {};
    for (const leitura of leituras) {
      if (typeof leitura.consumo === "number" && leitura.timestamp) {
        const dia = dayjs(leitura.timestamp).format("YYYY-MM-DD");
        consumoPorDia[dia] = (consumoPorDia[dia] || 0) + leitura.consumo;
      }
      // Salva cada leitura individualmente
      await push(ref(db, `bottles/${bottleId}/readings`), leitura);
    }

    // Salva o consumo acumulado diário
    for (const leitura of leituras) {
      if (typeof leitura.consumo === "number" && leitura.timestamp) {
        const dia = dayjs(leitura.timestamp).format("YYYY-MM-DD");
        consumoPorDia[dia] = (consumoPorDia[dia] || 0) + leitura.consumo;
      }
      // Salva cada leitura individualmente
      await push(ref(db, `bottles/${bottleId}/readings`), leitura);
    }

    // Para cada dia, busque o valor atual, some e salve de volta
    for (const dia in consumoPorDia) {
      const acumuladoRef = ref(db, `bottles/${bottleId}/readings/consumoAcumulado/${dia}`);
      const snapshot = await get(acumuladoRef);
      const valorAtual = snapshot.exists() ? snapshot.val() : 0;
      const novoValor = valorAtual + consumoPorDia[dia];
      await set(acumuladoRef, novoValor);
    }

    await set(ref(db, `bottles/${bottleId}/connectedUser`), uid);

    await AsyncStorage.removeItem('leiturasCache');
    console.log("Leituras e consumo acumulado diário sincronizados e cache limpo.");
  } catch (e) {
    console.log("Erro ao sincronizar leituras:", e);
  }
}, []);

  return (
    <DbContext.Provider value={{ salvarLeituraNoCache, sincronizarCacheComBanco, getConsumoAcumuladoNoCache, getConsumoAcumuladoDoDia }}>
      {children}
    </DbContext.Provider>
  );
};