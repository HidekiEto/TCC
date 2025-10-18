
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReminders } from '../../contexts/ReminderContext';
import { useNavigation } from '@react-navigation/native';

export default function ReminderWidget() {
  const { config, hasPermission, scheduledCount, getNextReminderTime } = useReminders();
  const navigation = useNavigation<any>();

  const nextReminder = getNextReminderTime();

  const handlePress = () => {
    navigation.navigate('ReminderSettings');
  };

  if (!config.enabled) {
    return (
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <MaterialCommunityIcons name="bell-off" size={24} color="#999" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Lembretes Desativados</Text>
          <Text style={styles.subtitle}>Toque para configurar</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    );
  }

  if (!hasPermission) {
    return (
      <TouchableOpacity style={[styles.container, styles.warning]} onPress={handlePress}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="#f44336" />
        <View style={styles.textContainer}>
          <Text style={styles.titleWarning}>Permissão Necessária</Text>
          <Text style={styles.subtitleWarning}>Toque para permitir notificações</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#f44336" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <MaterialCommunityIcons name="bell-ring" size={24} color="#4CAF50" />
      <View style={styles.textContainer}>
        <Text style={styles.titleActive}>Lembretes Ativos</Text>
        {nextReminder && (
          <Text style={styles.subtitle}>
            Próximo: {nextReminder.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
        {!nextReminder && scheduledCount > 0 && (
          <Text style={styles.subtitle}>{scheduledCount} lembretes configurados</Text>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#4CAF50" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  warning: {
    borderWidth: 1,
    borderColor: '#f44336',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  titleActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  titleWarning: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  subtitleWarning: {
    fontSize: 13,
    color: '#f44336',
    marginTop: 2,
  },
});
