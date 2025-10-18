
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface ReminderConfig {
  enabled: boolean;
  startHour: number;
  endHour: number;
  intervalMinutes: number;
  daysOfWeek: number[];
}

export interface NotificationData extends Record<string, unknown> {
  type: 'water_reminder' | 'goal_achieved' | 'milestone' | 'custom';
  timestamp: number;
  metadata?: Record<string, any>;
}

export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    } as Notifications.NotificationBehavior),
  });
}

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('water-reminders', {
        name: '💧 Lembretes de Água',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#29EBD5',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });

      await Notifications.setNotificationChannelAsync('achievements', {
        name: '🏆 Conquistas',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 500],
        lightColor: '#082862',
        sound: 'default',
      });

      console.log('✅ Canais de notificação configurados');
    } catch (error) {
      console.error('❌ Erro ao configurar canais:', error);
    }
  }
}

export async function checkNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('⚠️ Notificações não funcionam em emulador');
    return false;
  }

  const settings = await Notifications.getPermissionsAsync();
  return settings.status === 'granted';
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('⚠️ Notificações não funcionam em emulador');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status === 'granted') {
    console.log('✅ Permissões concedidas');
    return true;
  } else {
    console.warn('⚠️ Permissões negadas');
    return false;
  }
}

export async function scheduleNotification(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput,
  data?: NotificationData
): Promise<string | null> {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        throw new Error('Permissão de notificação negada');
      }
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: data || { type: 'custom', timestamp: Date.now() },
      },
      trigger,
    });

    console.log(`✅ Notificação agendada: ${id}`);
    return id;
  } catch (error) {
    console.error('❌ Erro ao agendar notificação:', error);
    return null;
  }
}

const WATER_REMINDER_MESSAGES = [
  { title: '💧 Hora de se hidratar!', body: 'Beba um copo de água agora' },
  { title: '💧 Lembrete de Hidratação', body: 'Não se esqueça de beber água!' },
  { title: '🌊 Momento da Água', body: 'Seu corpo precisa de água agora' },
  { title: '💙 AquaLink te lembra', body: 'Hidrate-se para manter a saúde!' },
  { title: '💧 Beba Água!', body: 'Mantenha-se hidratado ao longo do dia' },
  { title: '🥤 Pause e Hidrate', body: 'Hora de tomar um gole de água' },
];

function getRandomWaterMessage(): { title: string; body: string } {
  return WATER_REMINDER_MESSAGES[
    Math.floor(Math.random() * WATER_REMINDER_MESSAGES.length)
  ];
}

export async function scheduleWaterReminders(
  config: ReminderConfig
): Promise<number> {
  try {
    if (!config.enabled) {
      console.log('⏸️ Lembretes desabilitados');
      return 0;
    }

    await cancelAllWaterReminders();

    const { startHour, endHour, intervalMinutes, daysOfWeek } = config;
    let scheduledCount = 0;

    const times: { hour: number; minute: number }[] = [];
    let currentMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    while (currentMinutes <= endMinutes) {
      times.push({
        hour: Math.floor(currentMinutes / 60),
        minute: currentMinutes % 60,
      });
      currentMinutes += intervalMinutes;
    }

    console.log(`📅 Agendando ${times.length} horários`);
    
    for (const time of times) {
      const message = getRandomWaterMessage();
      
      const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute,
      };

      const id = await scheduleNotification(
        message.title,
        message.body,
        trigger,
        {
          type: 'water_reminder',
          timestamp: Date.now(),
          metadata: { hour: time.hour, minute: time.minute },
        }
      );

      if (id) scheduledCount++;
    }

    console.log(`✅ ${scheduledCount} lembretes agendados com sucesso`);
    return scheduledCount;
  } catch (error) {
    console.error('❌ Erro ao agendar lembretes:', error);
    return 0;
  }
}

export async function scheduleSimpleReminders(
  intervalMinutes: number = 120
): Promise<string | null> {
  try {
    await cancelAllWaterReminders();

    const message = getRandomWaterMessage();
    
    const id = await scheduleNotification(
      message.title,
      message.body,
      {
        seconds: intervalMinutes * 60,
        repeats: true,
      } as Notifications.TimeIntervalTriggerInput,
      {
        type: 'water_reminder',
        timestamp: Date.now(),
      }
    );

    return id;
  } catch (error) {
    console.error('❌ Erro ao agendar lembretes simples:', error);
    return null;
  }
}

export async function cancelNotification(id: string): Promise<boolean> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    console.log(`✅ Notificação ${id} cancelada`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao cancelar notificação ${id}:`, error);
    return false;
  }
}

export async function cancelAllWaterReminders(): Promise<boolean> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduled) {
      const data = notification.content.data as unknown as NotificationData;
      if (data?.type === 'water_reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    
    console.log('✅ Todos os lembretes de água cancelados');
    return true;
  } catch (error) {
    console.error('❌ Erro ao cancelar lembretes:', error);
    return false;
  }
}

export async function cancelAllNotifications(): Promise<boolean> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Todas as notificações canceladas');
    return true;
  } catch (error) {
    console.error('❌ Erro ao cancelar todas as notificações:', error);
    return false;
  }
}

export async function getScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📋 ${notifications.length} notificações agendadas`);
    return notifications;
  } catch (error) {
    console.error('❌ Erro ao listar notificações:', error);
    return [];
  }
}

export async function countWaterReminders(): Promise<number> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const waterReminders = scheduled.filter((notification) => {
      const data = notification.content.data as unknown as NotificationData;
      return data?.type === 'water_reminder';
    });
    return waterReminders.length;
  } catch (error) {
    console.error('❌ Erro ao contar lembretes:', error);
    return 0;
  }
}

export async function sendImmediateNotification(
  title: string,
  body: string,
  data?: NotificationData
): Promise<string | null> {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        throw new Error('Permissão de notificação negada');
      }
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        data: data || { type: 'custom', timestamp: Date.now() },
      },
      trigger: null,
    });

    console.log(`✅ Notificação imediata enviada: ${id}`);
    return id;
  } catch (error) {
    console.error('❌ Erro ao enviar notificação imediata:', error);
    return null;
  }
}

export async function notifyGoalAchieved(
  percentage: number
): Promise<string | null> {
  const messages = [
    { title: '🎉 Parabéns!', body: `Você atingiu ${percentage}% da sua meta!` },
    { title: '💪 Excelente!', body: `${percentage}% completo! Continue assim!` },
    { title: '🌟 Incrível!', body: `Você já está em ${percentage}% da meta!` },
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  return sendImmediateNotification(message.title, message.body, {
    type: 'goal_achieved',
    timestamp: Date.now(),
    metadata: { percentage },
  });
}

export async function notifyMilestone(
  milestone: string,
  description: string
): Promise<string | null> {
  return sendImmediateNotification(`🏆 ${milestone}`, description, {
    type: 'milestone',
    timestamp: Date.now(),
    metadata: { milestone },
  });
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: true,
  startHour: 8,
  endHour: 22,
  intervalMinutes: 120,
  daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
};

export function validateReminderConfig(config: ReminderConfig): boolean {
  if (config.startHour < 0 || config.startHour > 23) return false;
  if (config.endHour < 0 || config.endHour > 23) return false;
  if (config.startHour >= config.endHour) return false;
  if (config.intervalMinutes < 15 || config.intervalMinutes > 1440) return false;
  if (config.daysOfWeek.length === 0) return false;
  return true;
}

export function formatReminderConfig(config: ReminderConfig): string {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const selectedDays = config.daysOfWeek.map(d => days[d]).join(', ');
  const hours = Math.floor(config.intervalMinutes / 60);
  const minutes = config.intervalMinutes % 60;
  const interval = hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`
    : `${minutes}min`;

  return `${config.startHour}h - ${config.endHour}h, a cada ${interval}\nDias: ${selectedDays}`;
}
