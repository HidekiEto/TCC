import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

type UserData = {
	peso: number; // em kg
	altura: number; // em cm
	genero: 'masculino' | 'feminino' | 'outro';
	idade?: number;
};

export function calcularMetaSemanalAgua(user: UserData): number {
	let base = user.peso * 35; 
	
	if (user.genero === 'masculino') {
		base *= 1.05;
	} else if (user.genero === 'feminino') {
		base *= 0.95;
	}

	if (user.idade && user.idade > 60) {
		base *= 0.9;
	}
	
	const semanal = base * 7;
	console.log('Dados do usuário:', user);
	console.log('Meta semanal de água (ml):', semanal);
	return Math.round(semanal);
}

export function useConsumoUltimasSemanas(uid?: string): number[] {
	const [consumoSemanas, setConsumoSemanas] = useState([0, 0, 0, 0]);

	useEffect(() => {
		async function calcularConsumoSemanas() {
			if (!uid) return;
			
			try {
				const { collection, query, where, getDocs } = await import('firebase/firestore');
				const { firestore } = await import('../../config/firebase');
				const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
				
				const hoje = dayjs();
				
				const inicioIntervalo = hoje.startOf('week').subtract(3, 'week').format('YYYY-MM-DD');
				const fimIntervalo = hoje.format('YYYY-MM-DD');
				
				const q = query(
					collection(firestore, "consumoDiario"),
					where("userId", "==", uid),
					where("date", ">=", inicioIntervalo),
					where("date", "<=", fimIntervalo)
				);
				
				const snapshot = await getDocs(q);
				const consumoPorDia: Record<string, number> = {};
				
				snapshot.forEach((doc) => {
					const data = doc.data();
					consumoPorDia[data.date] = data.total || 0;
				});
				
				const cacheKey = `leiturasCache_${uid}`;
				const cacheStr = await AsyncStorage.getItem(cacheKey);
				const leituras = cacheStr ? JSON.parse(cacheStr) : [];
				
				const cachePorDia: Record<string, number> = {};
				for (const leitura of leituras) {
					if (typeof leitura.consumo === 'number' && leitura.timestamp) {
						const dia = dayjs(leitura.timestamp).format('YYYY-MM-DD');
						cachePorDia[dia] = (cachePorDia[dia] || 0) + leitura.consumo;
					}
				}
				
				const semanas: number[] = [];
				for (let i = 3; i >= 0; i--) {
					const inicioSemana = hoje.startOf('week').subtract(i, 'week');
					const fimSemana = inicioSemana.endOf('week');
					let soma = 0;
					
					for (let dia = inicioSemana; dia.isBefore(fimSemana.add(1, 'day')); dia = dia.add(1, 'day')) {
						const dataString = dia.format('YYYY-MM-DD');
						soma += (consumoPorDia[dataString] || 0) + (cachePorDia[dataString] || 0);
					}
					semanas.push(Math.round(soma));
				}
				
				setConsumoSemanas(semanas);
				console.log('📊 [WeeklyIntake] Consumo das últimas 4 semanas (Firestore + Cache):', semanas);
			} catch (e) {
				console.error('❌ [WeeklyIntake] Erro ao buscar consumo semanal:', e);
				setConsumoSemanas([0, 0, 0, 0]);
			}
		}
		calcularConsumoSemanas();
	}, [uid]);

	return consumoSemanas;
}

export function useConsumoUltimos7Dias(uid?: string): number[] {
	const [consumoDias, setConsumoDias] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

	useEffect(() => {
		async function calcularConsumoDias() {
			if (!uid) return;
			
			try {
				const { collection, query, where, getDocs } = await import('firebase/firestore');
				const { firestore } = await import('../../config/firebase');
				const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
				
				const hoje = dayjs();
				
				const inicioIntervalo = hoje.subtract(6, 'day').format('YYYY-MM-DD');
				const fimIntervalo = hoje.format('YYYY-MM-DD');
				
				const q = query(
					collection(firestore, "consumoDiario"),
					where("userId", "==", uid),
					where("date", ">=", inicioIntervalo),
					where("date", "<=", fimIntervalo)
				);
				
				const snapshot = await getDocs(q);
				const consumoPorDia: Record<string, number> = {};
				
				snapshot.forEach((doc) => {
					const data = doc.data();
					consumoPorDia[data.date] = data.total || 0;
				});
				
				const cacheKey = `leiturasCache_${uid}`;
				const cacheStr = await AsyncStorage.getItem(cacheKey);
				const leituras = cacheStr ? JSON.parse(cacheStr) : [];
				
				const cachePorDia: Record<string, number> = {};
				for (const leitura of leituras) {
					if (typeof leitura.consumo === 'number' && leitura.timestamp) {
						const dia = dayjs(leitura.timestamp).format('YYYY-MM-DD');
						cachePorDia[dia] = (cachePorDia[dia] || 0) + leitura.consumo;
					}
				}
				
				const dias: number[] = [];
				for (let i = 6; i >= 0; i--) {
					const diaAtual = hoje.subtract(i, 'day').format('YYYY-MM-DD');
					const totalFirestore = consumoPorDia[diaAtual] || 0;
					const totalCache = cachePorDia[diaAtual] || 0;
					dias.push(Math.round(totalFirestore + totalCache));
				}
				
				setConsumoDias(dias);
				console.log('📊 [WeeklyIntake] Consumo dos últimos 7 dias (Firestore + Cache):', dias);
			} catch (e) {
				console.error('❌ [WeeklyIntake] Erro ao buscar consumo:', e);
				setConsumoDias([0, 0, 0, 0, 0, 0, 0]);
			}
		}
		
		calcularConsumoDias();
	}, [uid]);

	return consumoDias;
}

export function useConsumoSemanasDoMesAtual(uid?: string): number[] {
	const [consumoSemanas, setConsumoSemanas] = useState<number[]>([0, 0, 0, 0]);

	useEffect(() => {
		async function calcularConsumoSemanasDoMes() {
			if (!uid) return;
			
			try {
				const { collection, query, where, getDocs } = await import('firebase/firestore');
				const { firestore } = await import('../../config/firebase');
				const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
				
				const hoje = dayjs();
				const mesAtual = hoje.month() + 1; // dayjs month é 0-11, precisamos 1-12
				const anoAtual = hoje.year();
				
				const startDate = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-01`;
				const endDate = hoje.endOf('month').format('YYYY-MM-DD');
				
				const q = query(
					collection(firestore, "consumoDiario"),
					where("userId", "==", uid),
					where("date", ">=", startDate),
					where("date", "<=", endDate)
				);
				
				const snapshot = await getDocs(q);
				const consumoPorDia: Record<string, number> = {};
				
				snapshot.forEach((doc) => {
					const data = doc.data();
					consumoPorDia[data.date] = data.total || 0;
				});
				
				const cacheKey = `leiturasCache_${uid}`;
				const cacheStr = await AsyncStorage.getItem(cacheKey);
				const leituras = cacheStr ? JSON.parse(cacheStr) : [];
				
				const cachePorDia: Record<string, number> = {};
				for (const leitura of leituras) {
					if (typeof leitura.consumo === 'number' && leitura.timestamp) {
						const dia = dayjs(leitura.timestamp).format('YYYY-MM-DD');
						cachePorDia[dia] = (cachePorDia[dia] || 0) + leitura.consumo;
					}
				}
				
				const semanas: number[] = [];
				const intervalos = [
					{ inicio: 1, fim: 7 },
					{ inicio: 8, fim: 14 },
					{ inicio: 15, fim: 21 },
					{ inicio: 22, fim: hoje.daysInMonth() }
				];

				for (const intervalo of intervalos) {
					let soma = 0;
					for (let dia = intervalo.inicio; dia <= intervalo.fim; dia++) {
						const dataString = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
						soma += (consumoPorDia[dataString] || 0) + (cachePorDia[dataString] || 0);
					}
					semanas.push(Math.round(soma));
				}

				setConsumoSemanas(semanas);
				console.log('📊 [WeeklyIntake] Consumo das 4 semanas do mês (Firestore + Cache):', semanas);
			} catch (e) {
				console.error('❌ [WeeklyIntake] Erro ao buscar consumo semanal:', e);
				setConsumoSemanas([0, 0, 0, 0]);
			}
		}
		
		calcularConsumoSemanasDoMes();
	}, [uid]);

	return consumoSemanas;
}
