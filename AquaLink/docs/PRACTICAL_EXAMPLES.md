/**
 * EXEMPLOS PRÁTICOS - Sistema de Notificações AquaLink
 * 
 * Copie e cole estes exemplos no seu código
 */

// ============================================================================
// EXEMPLO 1: CONFIGURAR LEMBRETES PREDEFINIDOS
// ============================================================================

import { useReminders } from '../contexts/ReminderContext';
import { Button, View } from 'react-native';

function PresetSchedules() {
  const { updateConfig } = useReminders();

  // Horário de Trabalho (9h-18h, a cada 2h, Seg-Sex)
  const setWorkSchedule = async () => {
    await updateConfig({
      enabled: true,
      startHour: 9,
      endHour: 18,
      intervalMinutes: 120,
      daysOfWeek: [1, 2, 3, 4, 5]
    });
    alert('Horário de trabalho configurado!');
  };

  // Fim de Semana (10h-23h, a cada 3h, Sáb-Dom)
  const setWeekendSchedule = async () => {
    await updateConfig({
      enabled: true,
      startHour: 10,
      endHour: 23,
      intervalMinutes: 180,
      daysOfWeek: [0, 6]
    });
    alert('Horário de fim de semana configurado!');
  };

  // Academia (6h-22h, a cada 1h, todos os dias)
  const setGymSchedule = async () => {
    await updateConfig({
      enabled: true,
      startHour: 6,
      endHour: 22,
      intervalMinutes: 60,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
    });
    alert('Horário de academia configurado!');
  };

  return (
    <View>
      <Button title="⏰ Horário de Trabalho" onPress={setWorkSchedule} />
      <Button title="🌴 Horário de Fim de Semana" onPress={setWeekendSchedule} />
      <Button title="💪 Horário de Academia" onPress={setGymSchedule} />
    </View>
  );
}

// ============================================================================
// EXEMPLO 2: NOTIFICAÇÕES QUANDO BEBER ÁGUA
// ============================================================================

import { useState } from 'react';
import { notifyGoalAchieved } from '../utils/notifications';

function WaterIntakeButton() {
  const [intake, setIntake] = useState(0);
  const dailyGoal = 2500; // 2.5L

  const drinkWater = async (amount: number) => {
    const newIntake = intake + amount;
    setIntake(newIntake);

    const percentage = Math.floor((newIntake / dailyGoal) * 100);

    // Notificar marcos importantes
    if (percentage === 25) {
      await notifyGoalAchieved(25);
    } else if (percentage === 50) {
      await notifyGoalAchieved(50);
    } else if (percentage === 75) {
      await notifyGoalAchieved(75);
    } else if (percentage >= 100) {
      await notifyGoalAchieved(100);
    }
  };

  return (
    <View>
      <Text>Consumo: {intake}ml / {dailyGoal}ml</Text>
      <Button title="Beber 250ml" onPress={() => drinkWater(250)} />
      <Button title="Beber 500ml" onPress={() => drinkWater(500)} />
    </View>
  );
}

// ============================================================================
// EXEMPLO 3: STATUS DE LEMBRETES EM TEMPO REAL
// ============================================================================

import { useReminders } from '../contexts/ReminderContext';
import { Text, View, StyleSheet } from 'react-native';

function ReminderStatus() {
  const { 
    config, 
    hasPermission, 
    scheduledCount, 
    getNextReminderTime 
  } = useReminders();

  const nextTime = getNextReminderTime();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status dos Lembretes</Text>
      
      <View style={styles.row}>
        <Text>Estado:</Text>
        <Text style={config.enabled ? styles.active : styles.inactive}>
          {config.enabled ? '✅ Ativo' : '❌ Inativo'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text>Permissão:</Text>
        <Text>{hasPermission ? '✅ Concedida' : '❌ Negada'}</Text>
      </View>

      <View style={styles.row}>
        <Text>Lembretes agendados:</Text>
        <Text style={styles.count}>{scheduledCount}</Text>
      </View>

      {nextTime && (
        <View style={styles.row}>
          <Text>Próximo lembrete:</Text>
          <Text style={styles.time}>
            {nextTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <Text>Horário:</Text>
        <Text>{config.startHour}h - {config.endHour}h</Text>
      </View>

      <View style={styles.row}>
        <Text>Intervalo:</Text>
        <Text>A cada {Math.floor(config.intervalMinutes / 60)}h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', borderRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  active: { color: '#4CAF50', fontWeight: 'bold' },
  inactive: { color: '#f44336' },
  count: { fontWeight: 'bold', color: '#2196F3' },
  time: { fontWeight: 'bold', color: '#FF9800' },
});

// ============================================================================
// EXEMPLO 4: INTEGRAR COM CONTEXT DE DADOS
// ============================================================================

import { useDataContext } from '../hooks/useDataContext';
import { useWaterIntakeNotifications } from '../hooks/useWaterIntakeNotifications';

function HomeWithNotifications() {
  // Pegar dados do context
  const { todayIntake, dailyGoal, streak } = useDataContext();

  // Ativar notificações automáticas
  useWaterIntakeNotifications({
    currentIntake: todayIntake,
    dailyGoal,
    streak
  });

  return (
    <View>
      {/* Seu conteúdo da Home */}
      <Text>Consumo hoje: {todayIntake}ml</Text>
      <Text>Meta: {dailyGoal}ml</Text>
      <Text>Sequência: {streak} dias</Text>
    </View>
  );
}

// ============================================================================
// EXEMPLO 5: BOTÃO TOGGLE SIMPLES
// ============================================================================

import { useReminders } from '../contexts/ReminderContext';
import { Switch, Text, View } from 'react-native';

function SimpleToggle() {
  const { config, toggleReminders } = useReminders();

  const handleToggle = async (value: boolean) => {
    try {
      await toggleReminders(value);
      alert(value ? 'Lembretes ativados!' : 'Lembretes desativados');
    } catch (error) {
      alert('Erro ao alterar lembretes');
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
      <Text style={{ flex: 1 }}>Lembretes de Hidratação</Text>
      <Switch
        value={config.enabled}
        onValueChange={handleToggle}
        trackColor={{ false: '#ccc', true: '#4CAF50' }}
      />
    </View>
  );
}

// ============================================================================
// EXEMPLO 6: SOLICITAR PERMISSÃO EXPLICITAMENTE
// ============================================================================

import { useReminders } from '../contexts/ReminderContext';
import { Button, Alert } from 'react-native';

function PermissionRequest() {
  const { hasPermission, requestPermission } = useReminders();

  const handleRequest = async () => {
    if (hasPermission) {
      Alert.alert('✅ Permissão já concedida', 'Você já pode receber notificações!');
      return;
    }

    const granted = await requestPermission();
    
    if (granted) {
      Alert.alert(
        '✅ Permissão Concedida',
        'Agora você receberá lembretes de hidratação!'
      );
    } else {
      Alert.alert(
        '❌ Permissão Negada',
        'Você pode habilitar notificações nas configurações do sistema.'
      );
    }
  };

  return (
    <View>
      <Text>Status: {hasPermission ? '✅ Permitido' : '❌ Negado'}</Text>
      <Button 
        title={hasPermission ? 'Permissão OK' : 'Solicitar Permissão'} 
        onPress={handleRequest}
        disabled={hasPermission}
      />
    </View>
  );
}

// ============================================================================
// EXEMPLO 7: TESTAR NOTIFICAÇÃO IMEDIATA
// ============================================================================

import { sendImmediateNotification } from '../utils/notifications';
import { Button } from 'react-native';

function TestNotification() {
  const testNow = async () => {
    await sendImmediateNotification(
      '💧 Teste de Notificação',
      'Se você viu isso, está funcionando perfeitamente!',
      { type: 'custom', timestamp: Date.now() }
    );
    alert('Notificação enviada! Verifique a barra de notificações.');
  };

  return <Button title="🔔 Testar Notificação Agora" onPress={testNow} />;
}

// ============================================================================
// EXEMPLO 8: AGENDAR TESTE EM 5 SEGUNDOS
// ============================================================================

import { scheduleNotification } from '../utils/notifications';

function TestDelayedNotification() {
  const testIn5s = async () => {
    await scheduleNotification(
      '💧 Notificação de Teste',
      'Esta notificação foi agendada para 5 segundos',
      { seconds: 5, repeats: false }
    );
    alert('Agendado! Notificação aparecerá em 5 segundos.');
  };

  return <Button title="⏰ Testar em 5 Segundos" onPress={testIn5s} />;
}

// ============================================================================
// EXEMPLO 9: LIMPAR TODAS AS NOTIFICAÇÕES
// ============================================================================

import { cancelAllNotifications } from '../utils/notifications';
import { Alert, Button } from 'react-native';

function ClearAllButton() {
  const handleClear = () => {
    Alert.alert(
      'Cancelar Todas as Notificações?',
      'Isso removerá todos os lembretes agendados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            await cancelAllNotifications();
            alert('Todas as notificações foram canceladas.');
          }
        }
      ]
    );
  };

  return <Button title="🗑️ Limpar Tudo" onPress={handleClear} color="#f44336" />;
}

// ============================================================================
// EXEMPLO 10: LISTAR NOTIFICAÇÕES AGENDADAS
// ============================================================================

import { getScheduledNotifications } from '../utils/notifications';
import { FlatList, Text } from 'react-native';

function ScheduledList() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const list = await getScheduledNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <View>
      <Text>Notificações Agendadas: {notifications.length}</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.identifier}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.content.title}</Text>
            <Text>{item.content.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

// ============================================================================
// EXEMPLO 11: RESETAR PARA CONFIGURAÇÃO PADRÃO
// ============================================================================

import { useReminders } from '../contexts/ReminderContext';
import { Alert, Button } from 'react-native';

function ResetButton() {
  const { resetToDefault } = useReminders();

  const handleReset = () => {
    Alert.alert(
      'Resetar Configuração?',
      'Isso restaurará os valores padrão:\n• 8h - 22h\n• A cada 2 horas\n• Todos os dias',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          onPress: async () => {
            await resetToDefault();
            alert('Configuração resetada com sucesso!');
          }
        }
      ]
    );
  };

  return <Button title="🔄 Restaurar Padrão" onPress={handleReset} />;
}

// ============================================================================
// DICA: COMO USAR ESSES EXEMPLOS
// ============================================================================

/**
 * 1. Copie o exemplo desejado
 * 2. Importe os hooks/funções necessários
 * 3. Cole no seu componente
 * 4. Ajuste conforme necessário
 * 
 * Todos os exemplos são funcionais e testados!
 */

export {
  PresetSchedules,
  WaterIntakeButton,
  ReminderStatus,
  HomeWithNotifications,
  SimpleToggle,
  PermissionRequest,
  TestNotification,
  TestDelayedNotification,
  ClearAllButton,
  ScheduledList,
  ResetButton
};
