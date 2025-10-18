import React, { createContext, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore } from "../config/firebase";
import { calcularMetaDiariaAgua } from "../components/Goals/DailyIntake";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  writeBatch
} from "firebase/firestore";
import { auth } from "../config/firebase";
import dayjs from "dayjs";

interface DbContextType {
  salvarLeituraNoCache: (leitura: any) => Promise<void>;
  sincronizarCacheComBanco: (bottleId: string) => Promise<void>;
  getConsumoAcumuladoNoCache: () => Promise<number>;
  getConsumoAcumuladoDoDia: (date?: string) => Promise<number>;
  getLeiturasDoMes: (year: number, month: number) => Promise<any[]>;
  adicionarLeituraSimulada: (consumo: number) => Promise<void>;
}

export const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = ({ children }: { children: React.ReactNode }) => {

  const salvarLeituraNoCache = useCallback(async (leitura: any) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Usuário não autenticado');
      
      const cacheKey = `leiturasCache_${uid}`;
      const cache = await AsyncStorage.getItem(cacheKey);
      let leituras = cache ? JSON.parse(cache) : [];
      
      leituras.push(leitura);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(leituras));
      
      console.log("✅ [DbFirestore] Leitura salva no cache local");
    } catch (e) {
      console.log("❌ [DbFirestore] Erro ao salvar leitura no cache:", e);
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

  const getConsumoAcumuladoDoDia = useCallback(async (date?: string) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return 0;
      
      const hoje = date || dayjs().format("YYYY-MM-DD");
      const docId = `${uid}_${hoje}`;
      
      const docRef = doc(firestore, "consumoDiario", docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().total || 0;
      }
      return 0;
    } catch (e) {
      console.log("❌ [DbFirestore] Erro ao obter consumo do dia:", e);
      return 0;
    }
  }, []);

  const getLeiturasDoMes = useCallback(async (year: number, month: number) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return [];
      
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = dayjs(`${year}-${month}-01`).endOf('month').format("YYYY-MM-DD");
      
      const q = query(
        collection(firestore, "consumoDiario"),
        where("userId", "==", uid),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("date", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      const leituras: any[] = [];
      
      querySnapshot.forEach((doc) => {
        leituras.push({ id: doc.id, ...doc.data() });
      });
      
      console.log(`✅ [DbFirestore] ${leituras.length} dias com leituras no mês ${month}/${year}`);
      return leituras;
    } catch (e) {
      console.log("❌ [DbFirestore] Erro ao obter leituras do mês:", e);
      return [];
    }
  }, []);

  const getUserProfile = useCallback(async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          peso: Number(data.weight) || 70,
          altura: Number(data.height) || 170,
          genero: (data.gender || 'masculino').toLowerCase() as 'masculino' | 'feminino' | 'outro',
          idade: data.birthdate ? (new Date().getFullYear() - new Date(data.birthdate).getFullYear()) : 30,
        };
      }
      return null;
    } catch (e) {
      console.log("❌ [DbFirestore] Erro ao buscar perfil:", e);
      return null;
    }
  }, []);

  const sincronizarCacheComBanco = useCallback(async (bottleId: string) => {
    try {
      console.log('🔄 [DbFirestore] Iniciando sincronização com Firestore...');
      console.log('🕐 [DbFirestore] Timestamp:', new Date().toLocaleString('pt-BR'));
      
      const uid = auth.currentUser?.uid;
      if (!uid) {
        throw new Error("Usuário não autenticado");
      }
      
      const cacheKey = `leiturasCache_${uid}`;
      const cache = await AsyncStorage.getItem(cacheKey);
      let leituras = cache ? JSON.parse(cache) : [];
      
      console.log(`📦 [DbFirestore] Leituras no cache: ${leituras.length}`);
      
      if (leituras.length === 0) {
        console.log('⚠️ [DbFirestore] Nenhuma leitura para sincronizar');
        return;
      }
    
      const batch = writeBatch(firestore);
      

      const consumoPorDia: Record<string, {
        total: number;
        numLeituras: number;
        leituras: any[];
      }> = {};
      
      console.log('📝 [DbFirestore] Processando leituras...');
      
      for (const leitura of leituras) {
        if (typeof leitura.consumo === "number" && leitura.timestamp) {
          const dia = dayjs(leitura.timestamp).format("YYYY-MM-DD");
          
          if (!consumoPorDia[dia]) {
            consumoPorDia[dia] = { total: 0, numLeituras: 0, leituras: [] };
          }
          
          consumoPorDia[dia].total += leitura.consumo;
          consumoPorDia[dia].numLeituras++;
          consumoPorDia[dia].leituras.push(leitura);
          
          const readingRef = doc(collection(firestore, `bottles/${bottleId}/readings`));
          batch.set(readingRef, {
            timestamp: Timestamp.fromMillis(leitura.timestamp),
            date: dia,
            hour: dayjs(leitura.timestamp).hour(),
            volume: leitura.volume || null,
            volumeAnterior: leitura.volumeAnterior || null,
            consumo: leitura.consumo,
            userId: uid,
          });
          
          console.log(`  ➡️ Leitura: ${leitura.consumo}ml em ${dia} às ${dayjs(leitura.timestamp).format('HH:mm')}`);
        }
      }
      
      console.log(`📊 [DbFirestore] Dias processados: ${Object.keys(consumoPorDia).length}`);
      
      const userProfile = await getUserProfile(uid);
      const metaDiaria = userProfile ? calcularMetaDiariaAgua(userProfile) : 2000;
      console.log('🎯 [DbFirestore] Meta diária do usuário:', metaDiaria, 'ml');
      
      console.log('💾 [DbFirestore] Atualizando consumo diário...');
      
      for (const dia in consumoPorDia) {
        const docId = `${uid}_${dia}`;
        const docRef = doc(firestore, "consumoDiario", docId);
        
        const docSnap = await getDoc(docRef);
        const existingTotal = docSnap.exists() ? (docSnap.data().total || 0) : 0;
        
        const novoTotal = existingTotal + consumoPorDia[dia].total;
        const totalLeituras = (docSnap.exists() ? (docSnap.data().numLeituras || 0) : 0) + consumoPorDia[dia].numLeituras;
        
        const percentual = Math.round((novoTotal / metaDiaria) * 100);
        
        batch.set(docRef, {
          userId: uid,
          bottleId: bottleId,
          date: dia,
          total: novoTotal,
          meta: metaDiaria, 
          percentual: percentual,
          numLeituras: totalLeituras,
          ultimaLeitura: Timestamp.fromMillis(
            consumoPorDia[dia].leituras[consumoPorDia[dia].leituras.length - 1].timestamp
          ),
        }, { merge: true });
        
        console.log(`  📅 ${dia}: ${existingTotal}ml + ${consumoPorDia[dia].total}ml = ${novoTotal}ml (${percentual}%)`);
      }
      
      const bottleRef = doc(firestore, "bottles", bottleId);
      batch.set(bottleRef, {
        connectedUser: uid,
        lastSync: Timestamp.now(),
      }, { merge: true });
      

      const userRef = doc(firestore, "users", uid);
      batch.set(userRef, {
        connectedBottle: bottleId,
      }, { merge: true });
      
      console.log('💾 [DbFirestore] Executando batch de escritas...');
      
      await batch.commit();
      
      console.log('🗑️ [DbFirestore] Limpando cache local...');
      await AsyncStorage.removeItem(cacheKey);
      
  
      const syncTimestamp = new Date().toISOString();
      await AsyncStorage.setItem('lastSyncTimestamp', syncTimestamp);
      
      console.log("✅ [DbFirestore] Sincronização concluída com sucesso!");
      console.log(`📈 [DbFirestore] Resumo: ${leituras.length} leituras em ${Object.keys(consumoPorDia).length} dias`);
      console.log('🕐 [DbFirestore] Concluído em:', new Date().toLocaleString('pt-BR'));
      
    } catch (e: any) {
      console.error("❌ [DbFirestore] Erro ao sincronizar:", e);
      console.error("❌ [DbFirestore] Detalhes:", e.message);
      throw e;
    }
  }, []);

  const adicionarLeituraSimulada = useCallback(async (consumo: number) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Usuário não autenticado');
      
      const cacheKey = `leiturasCache_${uid}`;
      const novaLeitura = {
        consumo,
        timestamp: Date.now(),
      };
      
      const cache = await AsyncStorage.getItem(cacheKey);
      let leituras = cache ? JSON.parse(cache) : [];
      leituras.push(novaLeitura);
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(leituras));
      console.log('✅ [DbFirestore] Leitura simulada adicionada:', novaLeitura);
    } catch (e) {
      console.log('❌ [DbFirestore] Erro ao adicionar leitura simulada:', e);
    }
  }, []);

  return (
    <DbContext.Provider value={{ 
      salvarLeituraNoCache, 
      sincronizarCacheComBanco, 
      getConsumoAcumuladoNoCache, 
      getConsumoAcumuladoDoDia,
      getLeiturasDoMes,
      adicionarLeituraSimulada 
    }}>
      {children}
    </DbContext.Provider>
  );
};
