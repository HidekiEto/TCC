
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDbContext } from '../../hooks/useDbContext';
import dayjs from 'dayjs';

// Hook para calcular o consumo mensal de água
export function useConsumoMensalAgua() {
	const { getConsumoAcumuladoNoCache } = useDbContext();
	const [consumoMensal, setConsumoMensal] = useState(0);

	useEffect(() => {
		async function calcularConsumoMensal() {
			const cache = await getConsumoAcumuladoNoCache();
			// Supondo que o cache contém leituras com timestamp e consumo
			let leituras = [];
			try {
				const cacheStr = await AsyncStorage.getItem('leiturasCache');
				leituras = cacheStr ? JSON.parse(cacheStr) : [];
			} catch (e) {
				leituras = [];
			}
			const mesAtual = dayjs().format('YYYY-MM');
			let soma = 0;
			for (const leitura of leituras) {
				if (typeof leitura.consumo === 'number' && leitura.timestamp) {
					const mesLeitura = dayjs(leitura.timestamp).format('YYYY-MM');
					if (mesLeitura === mesAtual) {
						soma += leitura.consumo;
					}
				}
			}
			setConsumoMensal(soma);
		}
		calcularConsumoMensal();
	}, [getConsumoAcumuladoNoCache]);

	return consumoMensal;
}
