/**
 * Sistema de Notificações para Lembretes de Hidratação
 * 
 * Este módulo gerencia todas as notificações locais do aplicativo,
 * incluindo agendamento, cancelamento e configuração de lembretes.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface ReminderConfig {
  enabled: boolean;
  startHour: number;      // Hora inicial (0-23)
  endHour: number;        // Hora final (0-23)
  intervalMinutes: number; // Intervalo entre notificações
  daysOfWeek: number[];   // NOTA: Mantido para UI, mas no Android lembretes são diários
                          // 0=Domingo, 1=Segunda, ..., 6=Sábado
}

export interface NotificationData extends Record<string, unknown> {
  type: 'water_reminder' | 'goal_achieved' | 'milestone' | 'custom';
  timestamp: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// CONFIGURAÇÃO INICIAL
// ============================================================================

/**
 * Configura o comportamento padrão das notificações
 * Deve ser chamado no início do app
 */
export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      // Campos específicos do iOS
      shouldShowBanner: true,
      shouldShowList: true,
    } as Notifications.NotificationBehavior),
  });
}

/**
 * Configura canal de notificação para Android
 * Necessário para Android 8.0+
 */
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

// ============================================================================
// PERMISSÕES
// ============================================================================

/**
 * Verifica se as permissões de notificação foram concedidas
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('⚠️ Notificações não funcionam em emulador');
    return false;
  }

  const settings = await Notifications.getPermissionsAsync();
  return settings.status === 'granted';
}

/**
 * Solicita permissões de notificação ao usuário
 */
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

// ============================================================================
// AGENDAMENTO DE NOTIFICAÇÕES
// ============================================================================

/**
 * Agenda uma notificação única
 */
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

/**
 * Mensagens variadas para lembretes de água
 */
const WATER_REMINDER_MESSAGES = [
  { title: '💧 Hora de se hidratar!', body: 'Beba um copo de água agora' },
  { title: '💧 Lembrete de Hidratação', body: 'Não se esqueça de beber água!' },
  { title: '🌊 Momento da Água', body: 'Seu corpo precisa de água agora' },
  { title: '💙 AquaLink te lembra', body: 'Hidrate-se para manter a saúde!' },
  { title: '💧 Beba Água!', body: 'Mantenha-se hidratado ao longo do dia' },
  { title: '🥤 Pause e Hidrate', body: 'Hora de tomar um gole de água' },
];

/**
 * Retorna uma mensagem aleatória para lembrete de água
 */
function getRandomWaterMessage(): { title: string; body: string } {
  return WATER_REMINDER_MESSAGES[
    Math.floor(Math.random() * WATER_REMINDER_MESSAGES.length)
  ];
}

/**
 * Agenda lembretes de água com base na configuração
 * 
 * IMPORTANTE: No Android, os lembretes são diários (todos os dias da semana).
 * A propriedade daysOfWeek é mantida na interface para compatibilidade com iOS
 * e futuras implementações, mas não é aplicada no Android devido a limitações
 * do trigger Calendar que não é suportado.
 * 
 * Solução: O usuário pode desativar lembretes manualmente nos dias que não quiser.
 */
export async function scheduleWaterReminders(
  config: ReminderConfig
): Promise<number> {
  try {
    if (!config.enabled) {
      console.log('⏸️ Lembretes desabilitados');
      return 0;
    }

    // Cancelar todos os lembretes existentes antes de agendar novos
    await cancelAllWaterReminders();

    const { startHour, endHour, intervalMinutes, daysOfWeek } = config;
    let scheduledCount = 0;

    // Calcular todos os horários do dia
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

    // NOTA: No Android, não podemos usar Calendar Trigger com dias específicos
    // Então agendamos notificações diárias para cada horário
    // O usuário pode desabilitar lembretes nos dias que não quiser
    
    for (const time of times) {
      const message = getRandomWaterMessage();
      
      // Usar DailyTriggerInput que funciona em Android e iOS
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

/**
 * Agenda lembretes simples por intervalo (alternativa mais simples)
 */
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

// ============================================================================
// CANCELAMENTO DE NOTIFICAÇÕES
// ============================================================================

/**
 * Cancela uma notificação específica
 */
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

/**
 * Cancela todos os lembretes de água
 */
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

/**
 * Cancela todas as notificações agendadas
 */
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

// ============================================================================
// CONSULTA DE NOTIFICAÇÕES
// ============================================================================

/**
 * Lista todas as notificações agendadas
 */
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

/**
 * Conta quantos lembretes de água estão agendados
 */
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

// ============================================================================
// NOTIFICAÇÕES IMEDIATAS
// ============================================================================

/**
 * Envia uma notificação imediata (sem agendamento)
 */
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
      trigger: null, // null = imediato
    });

    console.log(`✅ Notificação imediata enviada: ${id}`);
    return id;
  } catch (error) {
    console.error('❌ Erro ao enviar notificação imediata:', error);
    return null;
  }
}

/**
 * Notificação de meta atingida
 */
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

/**
 * Notificação de marco importante (streak, etc)
 */
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

// ============================================================================
// LISTENERS DE NOTIFICAÇÕES
// ============================================================================

/**
 * Adiciona listener para quando uma notificação é recebida (app em foreground)
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Adiciona listener para quando uma notificação é tocada pelo usuário
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Configuração padrão de lembretes
 */
export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: true,
  startHour: 8,  // 8h da manhã
  endHour: 22,   // 22h (10pm)
  intervalMinutes: 120, // A cada 2 horas
  daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // Todos os dias (0=Dom, 1=Seg, ..., 6=Sáb)
};

/**
 * Valida configuração de lembretes
 */
export function validateReminderConfig(config: ReminderConfig): boolean {
  if (config.startHour < 0 || config.startHour > 23) return false;
  if (config.endHour < 0 || config.endHour > 23) return false;
  if (config.startHour >= config.endHour) return false;
  if (config.intervalMinutes < 15 || config.intervalMinutes > 1440) return false;
  if (config.daysOfWeek.length === 0) return false;
  return true;
}

/**
 * Formata configuração para display
 */
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
