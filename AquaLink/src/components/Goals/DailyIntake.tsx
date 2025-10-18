import React from 'react';

type UserData = {
	peso: number; // em kg
	altura: number; // em cm
	genero: 'masculino' | 'feminino' | 'outro';
	idade?: number;
};

export function calcularMetaDiariaAgua(user: UserData): number {
	let base = user.peso * 35; // 35ml por kg
	if (user.genero === 'masculino') {
		base *= 1.05;
	} else if (user.genero === 'feminino') {
		base *= 0.95;
	}
	if (user.idade && user.idade > 60) {
		base *= 0.9;
	}
	console.log('Dados do usuário:', user);
	console.log('Meta diária de água (ml):', base);
	return Math.round(base);
}

