

import { useEffect, useRef } from 'react';
import { notifyGoalAchieved, notifyMilestone } from '../utils/notifications';

interface WaterIntakeNotificationOptions {
  currentIntake: number;
  dailyGoal: number;
  streak?: number;
}


export function useWaterIntakeNotifications({
  currentIntake,
  dailyGoal,
  streak = 0,
}: WaterIntakeNotificationOptions) {
  const notified25 = useRef(false);
  const notified50 = useRef(false);
  const notified75 = useRef(false);
  const notified100 = useRef(false);
  const lastStreak = useRef(0);

  useEffect(() => {
    if (dailyGoal === 0) return;

    const percentage = (currentIntake / dailyGoal) * 100;

    if (currentIntake === 0) {
      notified25.current = false;
      notified50.current = false;
      notified75.current = false;
      notified100.current = false;
    }

    if (percentage >= 25 && !notified25.current) {
      notified25.current = true;
      notifyGoalAchieved(25);
    }

    if (percentage >= 50 && !notified50.current) {
      notified50.current = true;
      notifyGoalAchieved(50);
    }

    if (percentage >= 75 && !notified75.current) {
      notified75.current = true;
      notifyGoalAchieved(75);
    }

    if (percentage >= 100 && !notified100.current) {
      notified100.current = true;
      notifyGoalAchieved(100);
      notifyMilestone('🎯 Meta Diária Completa!', 'Parabéns! Você atingiu sua meta de hidratação!');
    }
  }, [currentIntake, dailyGoal]);

  useEffect(() => {
    if (streak === 0 || streak === lastStreak.current) return;

    lastStreak.current = streak;

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

  const resetNotifications = () => {
    notified25.current = false;
    notified50.current = false;
    notified75.current = false;
    notified100.current = false;
  };

  return { resetNotifications };
}

