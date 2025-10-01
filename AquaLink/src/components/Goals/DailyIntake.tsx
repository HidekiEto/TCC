import React from 'react';

// Função para calcular a meta diária de consumo de água
// Fórmula exemplo: 35ml por kg de peso, ajustado por gênero e idade
type UserData = {
	peso: number; // em kg
	altura: number; // em cm
	genero: 'masculino' | 'feminino' | 'outro';
	idade?: number;
};

export function calcularMetaDiariaAgua(user: UserData): number {
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
	// Altura pode ser usada para outros ajustes se necessário
	console.log('Dados do usuário:', user);
	console.log('Meta diária de água (ml):', base);
	return Math.round(base);
}

// Exemplo de uso (remova ou adapte para integração real)
// const meta = calcularMetaDiariaAgua({ peso: 70, altura: 175, genero: 'masculino', idade: 30 });
// console.log('Meta diária:', meta, 'ml');
