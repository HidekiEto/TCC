import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useReminders } from '../contexts/ReminderContext';
import { formatReminderConfig } from '../utils/notifications';

export default function ReminderSettings() {
  const navigation = useNavigation();
  const {
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
  } = useReminders();

  const [localStartHour, setLocalStartHour] = useState(config.startHour);
  const [localEndHour, setLocalEndHour] = useState(config.endHour);
  const [localInterval, setLocalInterval] = useState(config.intervalMinutes);


  const handleToggle = async (value: boolean) => {
    try {
      if (value && !hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            'Permissão Necessária',
            'Para receber lembretes, você precisa permitir notificações.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      await toggleReminders(value);
      Alert.alert(
        'Sucesso',
        value ? 'Lembretes ativados!' : 'Lembretes desativados'
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar os lembretes');
    }
  };

  const handleSave = async () => {
    try {
      if (localStartHour >= localEndHour) {
        Alert.alert('Erro', 'Horário inicial deve ser menor que o final');
        return;
      }

      await updateConfig({
        startHour: localStartHour,
        endHour: localEndHour,
        intervalMinutes: localInterval,
      });

      Alert.alert('Sucesso', 'Configuração salva e lembretes atualizados!');
      await refreshScheduledCount();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a configuração');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Resetar Configuração',
      'Deseja restaurar as configurações padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetToDefault();
              setLocalStartHour(8);
              setLocalEndHour(22);
              setLocalInterval(120);
              Alert.alert('Sucesso', 'Configuração resetada!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível resetar');
            }
          },
        },
      ]
    );
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    Alert.alert(
      granted ? 'Permissão Concedida' : 'Permissão Negada',
      granted
        ? 'Agora você pode receber lembretes!'
        : 'Você precisará habilitar notificações nas configurações do sistema.'
    );
  };

  const handleToggleDay = async (day: number) => {
    const newDays = config.daysOfWeek.includes(day)
      ? config.daysOfWeek.filter((d) => d !== day)
      : [...config.daysOfWeek, day].sort();

    if (newDays.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um dia');
      return;
    }

    try {
      await updateConfig({ daysOfWeek: newDays });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dias');
    }
  };


  const nextReminder = getNextReminderTime();

  const intervalOptions = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hora', value: 60 },
    { label: '1h 30min', value: 90 },
    { label: '2 horas', value: 120 },
    { label: '3 horas', value: 180 },
  ];

  const days = [
    { label: 'Dom', value: 0 },
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sáb', value: 6 },
  ];


  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1399CF" barStyle="light-content" />
      <ScrollView style={styles.scrollContent}>
        {/* Header com Botão de Voltar */}
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>⏰ Lembretes de Hidratação</Text>
          <Text style={styles.subtitle}>
            Configure quando e como receber lembretes
          </Text>
        </View>
      </View>

        <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Lembretes Ativos</Text>
          <Switch
            value={config.enabled}
            onValueChange={handleToggle}
            trackColor={{ false: '#ccc', true: '#27D5E8' }}
            thumbColor={config.enabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {config.enabled && (
          <>
            <View style={styles.divider} />
            <Text style={styles.infoText}>
               {scheduledCount} lembretes agendados
            </Text>
            {nextReminder && (
              <Text style={styles.infoText}>
                ⏰ Próximo: {nextReminder.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </>
        )}

        {!hasPermission && (
          <>
            <View style={styles.divider} />
            <Text style={styles.warningText}>
              ⚠️ Permissão de notificação não concedida
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={handleRequestPermission}
            >
              <Text style={styles.permissionButtonText}>
                Solicitar Permissão
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Horários */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}> Horários</Text>

        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.label}>Início</Text>
            <View style={styles.timePickerContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() =>
                  setLocalStartHour(Math.max(0, localStartHour - 1))
                }
              >
                <Text style={styles.timeButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{localStartHour}h</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() =>
                  setLocalStartHour(Math.min(23, localStartHour + 1))
                }
              >
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.label}>Fim</Text>
            <View style={styles.timePickerContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() =>
                  setLocalEndHour(Math.max(0, localEndHour - 1))
                }
              >
                <Text style={styles.timeButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{localEndHour}h</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() =>
                  setLocalEndHour(Math.min(23, localEndHour + 1))
                }
              >
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Intervalo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}> Intervalo entre Lembretes</Text>
        <View style={styles.intervalGrid}>
          {intervalOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.intervalButton,
                localInterval === option.value && styles.intervalButtonActive,
              ]}
              onPress={() => setLocalInterval(option.value)}
            >
              <Text
                style={[
                  styles.intervalButtonText,
                  localInterval === option.value &&
                    styles.intervalButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dias da Semana</Text>
        <View style={styles.daysGrid}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                config.daysOfWeek.includes(day.value) &&
                  styles.dayButtonActive,
              ]}
              onPress={() => handleToggleDay(day.value)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  config.daysOfWeek.includes(day.value) &&
                    styles.dayButtonTextActive,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Resumo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo</Text>
        <Text style={styles.summaryText}>
          {formatReminderConfig({
            ...config,
            startHour: localStartHour,
            endHour: localEndHour,
            intervalMinutes: localInterval,
          })}
        </Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Salvar Configuração</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Restaurar Padrão</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
    marginTop: -1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1399CF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginTop: 10,
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#e3f2fd',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  warningText: {
    fontSize: 14,
    color: '#f44336',
    marginTop: 5,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeColumn: {
    alignItems: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeButton: {
    width: 30,
    height: 30,
    backgroundColor: '#0288D1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 60,
    textAlign: 'center',
  },
  intervalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  intervalButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  intervalButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#27D5E8',
  },
  intervalButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  intervalButtonTextActive: {
    color: '#082862',
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 45,
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayButtonActive: {
    backgroundColor: '#27D5E8',
    borderColor: '#1DB8CA',
  },
  dayButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  actionsContainer: {
    padding: 15,
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#082862',
  },
  resetButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 30,
  },
});
