# 📱 Sistema de Lembretes e Notificações - AquaLink

## 📋 Visão Geral

Sistema completo de notificações locais para lembretes de hidratação. Permite que usuários configurem horários personalizados para receber lembretes ao longo do dia.

## 🏗️ Arquitetura

### Componentes Principais

```
src/
├── utils/
│   └── notifications.ts          # Serviço de notificações (core)
├── contexts/
│   └── ReminderContext.tsx       # Gerenciamento de estado global
├── screens/
│   └── ReminderSettings.tsx      # Tela de configuração
└── components/
    └── HomeComponents/
        └── ReminderWidget.tsx    # Widget de status
```

## ✨ Funcionalidades

### 1. **Serviço de Notificações** (`notifications.ts`)

#### Configuração Inicial
```typescript
import { 
  setupNotificationHandler, 
  setupNotificationChannel 
} from './utils/notifications';

// Configurar handlers (uma vez no App.tsx)
setupNotificationHandler();
await setupNotificationChannel();
```

#### Agendar Lembretes
```typescript
import { scheduleWaterReminders, ReminderConfig } from './utils/notifications';

const config: ReminderConfig = {
  enabled: true,
  startHour: 8,      // Início: 8h
  endHour: 22,       // Fim: 22h (10pm)
  intervalMinutes: 120, // A cada 2 horas
  daysOfWeek: [1, 2, 3, 4, 5, 6, 7] // Todos os dias
};

await scheduleWaterReminders(config);
```

#### Notificações Imediatas
```typescript
import { notifyGoalAchieved, notifyMilestone } from './utils/notifications';

// Quando usuário atinge 50% da meta
await notifyGoalAchieved(50);

// Marco especial
await notifyMilestone('7 Dias Seguidos', 'Você manteve a constância por uma semana!');
```

### 2. **Context de Lembretes** (`ReminderContext.tsx`)

```typescript
import { useReminders } from './contexts/ReminderContext';

function MyComponent() {
  const {
    config,              // Configuração atual
    isLoading,           // Estado de carregamento
    hasPermission,       // Permissão concedida?
    scheduledCount,      // Quantos lembretes agendados
    updateConfig,        // Atualizar configuração
    toggleReminders,     // Ligar/desligar lembretes
    requestPermission,   // Solicitar permissão
    getNextReminderTime  // Próximo horário
  } = useReminders();

  // Exemplo: Alterar horário
  await updateConfig({
    startHour: 9,
    endHour: 21
  });

  // Exemplo: Ligar lembretes
  await toggleReminders(true);

  // Exemplo: Próximo lembrete
  const nextTime = getNextReminderTime();
  console.log('Próximo:', nextTime?.toLocaleTimeString());
}
```

### 3. **Tela de Configuração** (`ReminderSettings.tsx`)

Interface completa para usuário configurar:
- ✅ Ligar/desligar lembretes
- 🕐 Horário de início e fim
- ⏱️ Intervalo entre lembretes
- 📅 Dias da semana ativos
- 📊 Status e estatísticas

Navegação:
```typescript
navigation.navigate('ReminderSettings');
```

### 4. **Widget de Status** (`ReminderWidget.tsx`)

Exibe status resumido dos lembretes:
```tsx
import ReminderWidget from './components/HomeComponents/ReminderWidget';

<ReminderWidget />
```

## 📐 Tipos de Gatilhos

### 1. **Calendar Trigger** (Horário Específico)
Usado para lembretes diários em horários fixos.

```typescript
const trigger: CalendarTriggerInput = {
  type: SchedulableTriggerInputTypes.CALENDAR,
  hour: 9,        // 9h da manhã
  minute: 0,
  weekday: 2,     // 1=Dom, 2=Seg, ..., 7=Sáb
  repeats: true   // Repetir toda semana
};
```

### 2. **Time Interval Trigger** (Intervalo de Tempo)
Para lembretes repetidos em intervalos.

```typescript
const trigger: TimeIntervalTriggerInput = {
  seconds: 7200,  // A cada 2 horas
  repeats: true
};
```

### 3. **Immediate** (Imediato)
Para notificações instantâneas.

```typescript
trigger: null  // Dispara imediatamente
```

## 🎯 Exemplos de Uso

### Exemplo 1: Configuração Típica de Trabalho
```typescript
const workConfig: ReminderConfig = {
  enabled: true,
  startHour: 9,
  endHour: 18,
  intervalMinutes: 120,  // A cada 2 horas
  daysOfWeek: [1, 2, 3, 4, 5]  // Segunda a Sexta
};

await updateConfig(workConfig);
```

### Exemplo 2: Fim de Semana Relaxado
```typescript
const weekendConfig: ReminderConfig = {
  enabled: true,
  startHour: 10,
  endHour: 23,
  intervalMinutes: 180,  // A cada 3 horas
  daysOfWeek: [0, 6]  // Sábado e Domingo
};

await updateConfig(weekendConfig);
```

### Exemplo 3: Lembretes Frequentes
```typescript
const frequentConfig: ReminderConfig = {
  enabled: true,
  startHour: 8,
  endHour: 22,
  intervalMinutes: 60,  // A cada 1 hora
  daysOfWeek: [1, 2, 3, 4, 5, 6, 7]  // Todos os dias
};

await updateConfig(frequentConfig);
```

## 🔔 Permissões

### Android
Permissões são solicitadas automaticamente quando necessário.

### iOS
- Máximo de **64 notificações** agendadas simultaneamente
- Sistema iOS gerencia automaticamente prioridades

### Verificar Permissões
```typescript
import { checkNotificationPermissions } from './utils/notifications';

const hasPermission = await checkNotificationPermissions();
if (!hasPermission) {
  await requestNotificationPermissions();
}
```

## 📊 Estatísticas e Monitoramento

```typescript
import { 
  countWaterReminders, 
  getScheduledNotifications 
} from './utils/notifications';

// Contar lembretes de água
const count = await countWaterReminders();
console.log(`${count} lembretes agendados`);

// Listar todas as notificações
const all = await getScheduledNotifications();
all.forEach(notification => {
  console.log(notification.content.title);
});
```

## 🧪 Testes

Execute os testes:
```bash
npm test -- notifications.test.ts
```

Cobertura de testes:
- ✅ Validação de configurações
- ✅ Formatação de exibição
- ✅ Cenários de uso real
- ✅ Casos extremos

## 🔧 Configuração no App

### 1. Adicionar Provider no App.tsx
```tsx
import { ReminderProvider } from './src/contexts/ReminderContext';

<ReminderProvider>
  <YourApp />
</ReminderProvider>
```

### 2. Adicionar Rota
```tsx
// navigation/NavigationContainer.tsx
<Stack.Screen
  name="ReminderSettings"
  component={ReminderSettings}
  options={{ 
    headerShown: true,
    title: "Configurar Lembretes" 
  }}
/>
```

### 3. Adicionar ao Types
```typescript
// types/navigation.ts
export type RootStackParamList = {
  // ... outras rotas
  ReminderSettings: undefined;
};
```

## 🎨 Personalização

### Mensagens Customizadas
Edite o array `WATER_REMINDER_MESSAGES` em `notifications.ts`:

```typescript
const WATER_REMINDER_MESSAGES = [
  { title: '💧 Sua mensagem', body: 'Seu texto aqui' },
  // ... mais mensagens
];
```

### Sons Personalizados
```typescript
await Notifications.setNotificationChannelAsync('water-reminders', {
  name: '💧 Lembretes de Água',
  sound: 'water_drop.wav',  // Arquivo de som customizado
  // ... outras configurações
});
```

### Cores e Ícones
```typescript
await Notifications.setNotificationChannelAsync('water-reminders', {
  lightColor: '#0288D1',  // Cor da luz LED
  vibrationPattern: [0, 250, 250, 250],  // Padrão de vibração
});
```

## 📱 Limitações por Plataforma

| Recurso | iOS | Android |
|---------|-----|---------|
| Max. notificações | 64 | Ilimitado |
| Som customizado | ✅ | ✅ |
| Canais de notificação | ❌ | ✅ (obrigatório) |
| Badge no ícone | ✅ | ✅ |
| Ações rápidas | ✅ | ✅ |
| Funciona com app fechado | ✅ | ✅ |

## 🐛 Troubleshooting

### Notificações não aparecem
1. Verificar permissões: `await checkNotificationPermissions()`
2. Verificar se há notificações agendadas: `await countWaterReminders()`
3. Verificar configuração: `console.log(config)`

### Limite do iOS excedido
```typescript
const count = await countWaterReminders();
if (count > 64) {
  // Reduzir intervalo ou dias da semana
  await updateConfig({ 
    intervalMinutes: 180  // Aumentar intervalo
  });
}
```

### Notificações não repetem
Certifique-se de que `repeats: true` está definido no trigger.

## 📚 Recursos Adicionais

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [iOS Notification Guidelines](https://developer.apple.com/design/human-interface-guidelines/notifications)
- [Android Notification Channels](https://developer.android.com/develop/ui/views/notifications/channels)

## 🤝 Contribuindo

Para adicionar novos tipos de notificações:

1. Adicione tipo em `NotificationData`
2. Crie função específica em `notifications.ts`
3. Adicione canal se necessário (Android)
4. Teste em ambas as plataformas

## 📝 Notas Importantes

- ⚠️ Notificações não funcionam em emuladores
- 💾 Configurações são persistidas automaticamente
- 🔄 Lembretes são reagendados após mudanças
- 🌐 Sistema funciona offline (notificações locais)
- 🔋 Consumo de bateria mínimo

---

**Desenvolvido para AquaLink** 💧
