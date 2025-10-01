import React from 'react';

// Função para calcular a meta semanal de consumo de água
// Base: meta diária multiplicada por 7
type UserData = {
	peso: number; // em kg
	altura: number; // em cm
	genero: 'masculino' | 'feminino' | 'outro';
	idade?: number;
};

export function calcularMetaSemanalAgua(user: UserData): number {
	let base = user.peso * 35; // 35ml por kg
	// Ajuste por gênero
	if (user.genero === 'masculino') {
		base *= 1.05;
	} else if (user.genero === 'feminino') {
		base *= 0.95;
	}
	// Ajuste por idade (opcional)
	if (user.idade && user.idade > 60) {
		base *= 0.9;
	}
	// Meta semanal: meta diária * 7
	const semanal = base * 7;
	console.log('Dados do usuário:', user);
	console.log('Meta semanal de água (ml):', semanal);
	return Math.round(semanal);
}
// Exemplo de uso (remova ou adapte para integração real)
// const metaSemanal = calcularMetaSemanalAgua({ peso: 70, altura: 175, genero: 'masculino', idade: 30 });
// console.log('Meta semanal:', metaSemanal, 'ml');

// Hook para calcular o consumo semanal real do usuário
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

// Retorna array com consumo real das últimas 4 semanas
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
