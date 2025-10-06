import React from 'react';


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

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';


export function useConsumoUltimasSemanas(uid?: string): number[] {
	const [consumoSemanas, setConsumoSemanas] = useState([0, 0, 0, 0]);

	useEffect(() => {
		async function calcularConsumoSemanas() {
			if (!uid) return;
			let leituras = [];
			try {
				const cacheStr = await AsyncStorage.getItem(`leiturasCache_${uid}`);
				leituras = cacheStr ? JSON.parse(cacheStr) : [];
			} catch (e) {
				leituras = [];
			}
			const semanas: number[] = [];
			for (let i = 3; i >= 0; i--) {
				const inicioSemana = dayjs().startOf('week').subtract(i, 'week');
				const fimSemana = inicioSemana.endOf('week');
				let soma = 0;
				for (const leitura of leituras) {
					if (typeof leitura.consumo === 'number' && leitura.timestamp) {
						const dataLeitura = dayjs(leitura.timestamp);
						if (dataLeitura.isAfter(inicioSemana.subtract(1, 'day')) && dataLeitura.isBefore(fimSemana.add(1, 'day'))) {
							soma += leitura.consumo;
						}
					}
				}
				semanas.push(soma);
			}
			setConsumoSemanas(semanas);
		}
		calcularConsumoSemanas();
	}, [uid]);

	return consumoSemanas;
}

// Hook para obter consumo dos últimos 7 dias (dia a dia)
export function useConsumoUltimos7Dias(uid?: string): number[] {
	const [consumoDias, setConsumoDias] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

	useEffect(() => {
		async function calcularConsumoDias() {
			if (!uid) return;
			let leituras = [];
			try {
				const cacheStr = await AsyncStorage.getItem(`leiturasCache_${uid}`);
				leituras = cacheStr ? JSON.parse(cacheStr) : [];
			} catch (e) {
				leituras = [];
			}

			// Array para os últimos 7 dias (do mais antigo ao mais recente)
			const dias: number[] = [];
			const hoje = dayjs();

			// Loop de 6 dias atrás até hoje (7 dias no total)
			for (let i = 6; i >= 0; i--) {
				const diaAtual = hoje.subtract(i, 'day');
				const inicioDia = diaAtual.startOf('day');
				const fimDia = diaAtual.endOf('day');
				
				let somaConsumoDia = 0;
				
				// Soma todo o consumo daquele dia
				for (const leitura of leituras) {
					if (typeof leitura.consumo === 'number' && leitura.timestamp) {
						const dataLeitura = dayjs(leitura.timestamp);
						if (dataLeitura.isAfter(inicioDia.subtract(1, 'second')) && 
						    dataLeitura.isBefore(fimDia.add(1, 'second'))) {
							somaConsumoDia += leitura.consumo;
						}
					}
				}
				
				dias.push(Math.round(somaConsumoDia));
			}

			setConsumoDias(dias);
			console.log('📊 Consumo dos últimos 7 dias:', dias);
		}
		
		calcularConsumoDias();
	}, [uid]);

	return consumoDias;
}
