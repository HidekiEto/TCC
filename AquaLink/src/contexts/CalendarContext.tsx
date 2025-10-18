import React, { createContext, useState, useEffect, useCallback } from "react";
import { auth } from "../config/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import { calcularMetaDiariaAgua } from "../components/Goals/DailyIntake";

interface CalendarContextType {
  markedDates: { [key: string]: any };
  diasMetaAlcancada: number;
  totalAguaMes: number;
  loading: boolean;
  refreshCalendarData: () => Promise<void>;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [diasMetaAlcancada, setDiasMetaAlcancada] = useState(0);
  const [totalAguaMes, setTotalAguaMes] = useState(0);
  const [loading, setLoading] = useState(true);

  const getConnectedBottleId = async (uid: string) => {
    try {
      const userRef = doc(firestore, "users", uid);
      const snapshot = await getDoc(userRef);
      return snapshot.exists() ? (snapshot.data().connectedBottle || null) : null;
    } catch (e) {
      console.log("❌ [CalendarContext] Erro ao buscar garrafa:", e);
      return null;
    }
  };

  const getUserProfile = async (uid: string) => {
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
      console.log('Erro ao buscar perfil do usuário:', e);
      return null;
    }
  };

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📅 [CalendarContext] ========== INÍCIO DA CARGA ==========');
      
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log('❌ [CalendarContext] Usuário não autenticado');
        setLoading(false);
        return;
      }
      console.log('👤 [CalendarContext] UID:', uid);

      
      const userProfile = await getUserProfile(uid);
      const metaDiaria = userProfile ? calcularMetaDiariaAgua(userProfile) : 2000;
      console.log('🎯 [CalendarContext] Meta diária:', metaDiaria, 'ml');

  
      const hoje = dayjs();
      const mesAtual = hoje.month();
      const anoAtual = hoje.year();
      const diasNoMes = hoje.daysInMonth();
      const mesAnoAtual = hoje.format('YYYY-MM');
      console.log('📆 [CalendarContext] Analisando:', hoje.format('MMMM/YYYY'), `(${diasNoMes} dias)`);

      let leituras = [];
      try {
        const cacheStr = await AsyncStorage.getItem(`leiturasCache_${uid}`);
        leituras = cacheStr ? JSON.parse(cacheStr) : [];
        console.log('📦 [CalendarContext] Leituras no cache:', leituras.length);
      } catch (e) {
        console.log('⚠️ [CalendarContext] Erro ao ler cache:', e);
        leituras = [];
      }


      const bottleId = await getConnectedBottleId(uid);
      let consumoFirebase: Record<string, number> = {};
      
      if (bottleId) {
        console.log('🍾 [CalendarContext] Garrafa ID:', bottleId);
        
        try {
     
          const startDate = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-01`;
          const endDate = dayjs().year(anoAtual).month(mesAtual).endOf('month').format("YYYY-MM-DD");
          
          const q = query(
            collection(firestore, "consumoDiario"),
            where("userId", "==", uid),
            where("date", ">=", startDate),
            where("date", "<=", endDate)
          );
          
          const querySnapshot = await getDocs(q);
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            consumoFirebase[data.date] = data.total || 0;
          });
          
          console.log('☁️ [CalendarContext] Dados do Firestore:', Object.keys(consumoFirebase).length, 'dias');
        } catch (e) {
          console.log('❌ [CalendarContext] Erro ao buscar do Firestore:', e);
        }
      } else {
        console.log('⚠️ [CalendarContext] Nenhuma garrafa conectada');
      }

     
      const consumoCache: Record<string, number> = {};
      for (const leitura of leituras) {
        if (typeof leitura.consumo === 'number' && leitura.timestamp) {
          const dataLeitura = dayjs(leitura.timestamp).format('YYYY-MM-DD');
          const mesLeitura = dayjs(leitura.timestamp).format('YYYY-MM');
          
       
          if (mesLeitura === mesAnoAtual) {
            consumoCache[dataLeitura] = (consumoCache[dataLeitura] || 0) + leitura.consumo;
          }
        }
      }
      console.log('💾 [CalendarContext] Consumo do cache:', Object.keys(consumoCache).length, 'dias');

 
      const consumoCombinado: Record<string, number> = { ...consumoFirebase };
      

      for (const dia in consumoCache) {
        if (consumoCombinado[dia]) {
          consumoCombinado[dia] += consumoCache[dia];
        } else {
          consumoCombinado[dia] = consumoCache[dia];
        }
      }
      
      console.log('� [CalendarContext] Consumo combinado:', Object.keys(consumoCombinado).length, 'dias');
      console.log('📊 [CalendarContext] Dados completos:', JSON.stringify(consumoCombinado, null, 2));

      const marked: { [key: string]: any } = {};
      let diasComMeta = 0;
      let totalMes = 0;


      for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataString = dayjs().year(anoAtual).month(mesAtual).date(dia).format('YYYY-MM-DD');
        const consumoDia = consumoCombinado[dataString];

        if (consumoDia !== undefined && consumoDia !== null) {
          totalMes += consumoDia;
          console.log(`  📅 ${dataString}: ${consumoDia}ml ${consumoDia >= metaDiaria ? '✅ META!' : '⚠️ sem meta'}`);


          if (consumoDia >= metaDiaria) {
            marked[dataString] = {
              marked: true,
              dotColor: '#1DBF84',
              customStyles: {
                container: {
                  backgroundColor: '#E8F8F5',
                  borderRadius: 16,
                },
                text: {
                  color: '#1DBF84',
                  fontWeight: 'bold',
                },
              },
            };
            diasComMeta++;
          } else {

            marked[dataString] = {
              marked: true,
              dotColor: '#FFA500',
            };
          }
        }
      }


      const hoje_string = hoje.format('YYYY-MM-DD');
      console.log('📍 [CalendarContext] Dia atual:', hoje_string);
      
      if (!marked[hoje_string]) {
        marked[hoje_string] = {
          selected: true,
          selectedColor: '#27D5E8',
        };
      } else {
        marked[hoje_string] = {
          ...marked[hoje_string],
          selected: true,
          selectedColor: marked[hoje_string].customStyles ? '#1DBF84' : '#27D5E8',
        };
      }

      setMarkedDates(marked);
      setDiasMetaAlcancada(diasComMeta);
      setTotalAguaMes(Math.round(totalMes * 10) / 10); 
      
      console.log('✅ [CalendarContext] ========== RESUMO ==========');
      console.log(`📊 [CalendarContext] Dias com meta: ${diasComMeta}/${diasNoMes}`);
      console.log(`💧 [CalendarContext] Total do mês: ${(totalMes / 1000).toFixed(1)}L (${totalMes}ml)`);
      console.log(`🗓️ [CalendarContext] Datas marcadas:`, Object.keys(marked).length);
      console.log('📅 [CalendarContext] ========== FIM DA CARGA ==========');
    } catch (error) {
      console.error('❌ [CalendarContext] Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const refreshCalendarData = async () => {
    await loadCalendarData();
  };

  return (
    <CalendarContext.Provider 
      value={{ 
        markedDates, 
        diasMetaAlcancada, 
        totalAguaMes, 
        loading,
        refreshCalendarData 
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
