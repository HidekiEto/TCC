
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ReminderConfig,
  DEFAULT_REMINDER_CONFIG,
  setupNotificationHandler,
  setupNotificationChannel,
  scheduleWaterReminders,
  cancelAllWaterReminders,
  requestNotificationPermissions,
  checkNotificationPermissions,
  countWaterReminders,
  getScheduledNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  validateReminderConfig,
} from '../utils/notifications';
import * as Notifications from 'expo-notifications';


interface ReminderContextData {
 
  config: ReminderConfig;
  isLoading: boolean;
  hasPermission: boolean;
  scheduledCount: number;
  
 
  updateConfig: (newConfig: Partial<ReminderConfig>) => Promise<void>;
  toggleReminders: (enabled: boolean) => Promise<void>;
  requestPermission: () => Promise<boolean>;
  refreshScheduledCount: () => Promise<void>;
  resetToDefault: () => Promise<void>;
  
 
  getNextReminderTime: () => Date | null;
}

const ReminderContext = createContext<ReminderContextData | undefined>(undefined);

const STORAGE_KEY = '@aqualink:reminder_config';

interface ReminderProviderProps {
  children: ReactNode;
}

export function ReminderProvider({ children }: ReminderProviderProps) {
  const [config, setConfig] = useState<ReminderConfig>(DEFAULT_REMINDER_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

 
  useEffect(() => {
    initializeReminders();
  }, []);


  async function initializeReminders() {
    try {
      setIsLoading(true);

    
      setupNotificationHandler();
      await setupNotificationChannel();

     
      const permission = await checkNotificationPermissions();
      setHasPermission(permission);

      const savedConfig = await loadConfig();
      setConfig(savedConfig);

      const count = await countWaterReminders();
      setScheduledCount(count);

    
      if (savedConfig.enabled && permission && count === 0) {
        console.log('🔄 Reagendando lembretes...');
        await scheduleWaterReminders(savedConfig);
        const newCount = await countWaterReminders();
        setScheduledCount(newCount);
      }

      console.log('✅ Sistema de lembretes inicializado');
    } catch (error) {
      console.error(' Erro ao inicializar lembretes:', error);
    } finally {
      setIsLoading(false);
    }
  }



  useEffect(() => {
  
    const receivedSubscription = addNotificationReceivedListener((notification) => {
      console.log('📬 Notificação recebida:', notification.request.content.title);
    });

   
    const responseSubscription = addNotificationResponseListener((response) => {
      console.log('👆 Notificação tocada:', response.notification.request.content.title);
    
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  async function loadConfig(): Promise<ReminderConfig> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ReminderConfig;
        console.log('📂 Configuração carregada:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configuração:', error);
    }
    return DEFAULT_REMINDER_CONFIG;
  }

  async function saveConfig(newConfig: ReminderConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      console.log('💾 Configuração salva');
    } catch (error) {
      console.error('❌ Erro ao salvar configuração:', error);
    }
  }

  async function updateConfig(newConfig: Partial<ReminderConfig>): Promise<void> {
    try {
      const updatedConfig = { ...config, ...newConfig };

      if (!validateReminderConfig(updatedConfig)) {
        throw new Error('Configuração inválida');
      }

      setConfig(updatedConfig);

      await saveConfig(updatedConfig);

      if (updatedConfig.enabled && hasPermission) {
        await scheduleWaterReminders(updatedConfig);
        await refreshScheduledCount();
        console.log('✅ Lembretes atualizados e reagendados');
      } else if (!updatedConfig.enabled) {
        await cancelAllWaterReminders();
        setScheduledCount(0);
        console.log('⏸️ Lembretes cancelados');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar configuração:', error);
      throw error;
    }
  }

  async function toggleReminders(enabled: boolean): Promise<void> {
    try {
      if (enabled && !hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permissão necessária para ativar lembretes');
        }
      }

      await updateConfig({ enabled });
    } catch (error) {
      console.error('❌ Erro ao alternar lembretes:', error);
      throw error;
    }
  }

  async function requestPermission(): Promise<boolean> {
    try {
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);

      if (granted && config.enabled) {
        await scheduleWaterReminders(config);
        await refreshScheduledCount();
      }

      return granted;
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      return false;
    }
  }

  async function refreshScheduledCount(): Promise<void> {
    try {
      const count = await countWaterReminders();
      setScheduledCount(count);
    } catch (error) {
      console.error('❌ Erro ao contar notificações:', error);
    }
  }

  async function resetToDefault(): Promise<void> {
    try {
      setConfig(DEFAULT_REMINDER_CONFIG);
      await saveConfig(DEFAULT_REMINDER_CONFIG);
      
      if (hasPermission && DEFAULT_REMINDER_CONFIG.enabled) {
        await scheduleWaterReminders(DEFAULT_REMINDER_CONFIG);
        await refreshScheduledCount();
      }
      
      console.log('🔄 Configuração resetada para padrão');
    } catch (error) {
      console.error('❌ Erro ao resetar configuração:', error);
      throw error;
    }
  }

  function getNextReminderTime(): Date | null {
    if (!config.enabled || scheduledCount === 0) {
      return null;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = config.startHour * 60;
    const endMinutes = config.endHour * 60;

    if (currentMinutes < startMinutes) {
      const next = new Date();
      next.setHours(config.startHour, 0, 0, 0);
      return next;
    }

    if (currentMinutes > endMinutes) {
      const next = new Date();
      next.setDate(next.getDate() + 1);
      next.setHours(config.startHour, 0, 0, 0);
      return next;
    }

    let nextMinutes = startMinutes;
    while (nextMinutes <= endMinutes) {
      if (nextMinutes > currentMinutes) {
        const next = new Date();
        next.setHours(Math.floor(nextMinutes / 60), nextMinutes % 60, 0, 0);
        return next;
      }
      nextMinutes += config.intervalMinutes;
    }

    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(config.startHour, 0, 0, 0);
    return next;
  }

  const value: ReminderContextData = {
    config,
    isLoading,
    hasPermission,
    scheduledCount,
    updateConfig,
    toggleReminders,
    requestPermission,
    refreshScheduledCount,
    resetToDefault,
    getNextReminderTime,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders(): ReminderContextData {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders deve ser usado dentro de ReminderProvider');
  }
  return context;
}
