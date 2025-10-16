/**
 * Hook Personalizado para Integração de Notificações com Consumo de Água
 * 
 * Use este hook para automaticamente enviar notificações quando
 * o usuário atingir metas ou marcos importantes.
 */

import { useEffect, useRef } from 'react';
import { notifyGoalAchieved, notifyMilestone } from '../utils/notifications';

interface WaterIntakeNotificationOptions {
  currentIntake: number;
  dailyGoal: number;
  streak?: number;
}

/**
 * Hook que monitora o consumo de água e envia notificações automáticas
 */
export function useWaterIntakeNotifications({
  currentIntake,
  dailyGoal,
  streak = 0,
}: WaterIntakeNotificationOptions) {
  // Refs para evitar notificações duplicadas
  const notified25 = useRef(false);
  const notified50 = useRef(false);
  const notified75 = useRef(false);
  const notified100 = useRef(false);
  const lastStreak = useRef(0);

  useEffect(() => {
    if (dailyGoal === 0) return;

    const percentage = (currentIntake / dailyGoal) * 100;

    // Resetar flags se a meta for zerada (novo dia)
    if (currentIntake === 0) {
      notified25.current = false;
      notified50.current = false;
      notified75.current = false;
      notified100.current = false;
    }

    // Notificar 25%
    if (percentage >= 25 && !notified25.current) {
      notified25.current = true;
      notifyGoalAchieved(25);
    }

    // Notificar 50%
    if (percentage >= 50 && !notified50.current) {
      notified50.current = true;
      notifyGoalAchieved(50);
    }

    // Notificar 75%
    if (percentage >= 75 && !notified75.current) {
      notified75.current = true;
      notifyGoalAchieved(75);
    }

    // Notificar 100% (meta completa!)
    if (percentage >= 100 && !notified100.current) {
      notified100.current = true;
      notifyGoalAchieved(100);
      notifyMilestone('🎯 Meta Diária Completa!', 'Parabéns! Você atingiu sua meta de hidratação!');
    }
  }, [currentIntake, dailyGoal]);

  // Notificações de Streak (sequência de dias)
  useEffect(() => {
    if (streak === 0 || streak === lastStreak.current) return;

    lastStreak.current = streak;

    // Marcos especiais de streak
    if (streak === 3) {
      notifyMilestone('🔥 3 Dias Seguidos!', 'Você está criando um hábito saudável!');
    } else if (streak === 7) {
      notifyMilestone('⭐ 1 Semana Completa!', 'Uma semana de hidratação consistente!');
    } else if (streak === 14) {
      notifyMilestone('💪 2 Semanas!', 'Você está no caminho certo!');
    } else if (streak === 30) {
      notifyMilestone('🏆 1 Mês Completo!', 'Um mês de hábitos saudáveis! Incrível!');
    } else if (streak === 100) {
      notifyMilestone('👑 100 Dias!', 'Você é um campeão da hidratação!');
    }
  }, [streak]);

  // Retornar função para reset manual se necessário
  const resetNotifications = () => {
    notified25.current = false;
    notified50.current = false;
    notified75.current = false;
    notified100.current = false;
  };

  return { resetNotifications };
}

// ============================================================================
// EXEMPLO DE USO
// ============================================================================

/**
 * Exemplo 1: Usar na tela Home
 * 
 * import { useWaterIntakeNotifications } from '../hooks/useWaterIntakeNotifications';
 * 
 * function Home() {
 *   const currentIntake = 1500; // ml bebidos hoje
 *   const dailyGoal = 2500;     // meta diária
 *   const streak = 5;           // dias seguidos
 * 
 *   useWaterIntakeNotifications({
 *     currentIntake,
 *     dailyGoal,
 *     streak
 *   });
 * 
 *   return <View>...</View>;
 * }
 */

/**
 * Exemplo 2: Integrar com Context
 * 
 * import { useDataContext } from '../hooks/useDataContext';
 * import { useWaterIntakeNotifications } from '../hooks/useWaterIntakeNotifications';
 * 
 * function Home() {
 *   const { todayIntake, dailyGoal, streak } = useDataContext();
 * 
 *   useWaterIntakeNotifications({
 *     currentIntake: todayIntake,
 *     dailyGoal,
 *     streak
 *   });
 * 
 *   return <View>...</View>;
 * }
 */

/**
 * Exemplo 3: Reset manual
 * 
 * function Home() {
 *   const { resetNotifications } = useWaterIntakeNotifications({
 *     currentIntake: 1000,
 *     dailyGoal: 2500
 *   });
 * 
 *   // Chamar quando necessário (ex: usuário reseta o dia)
 *   const handleReset = () => {
 *     resetNotifications();
 *   };
 * 
 *   return <Button onPress={handleReset}>Reset</Button>;
 * }
 */
