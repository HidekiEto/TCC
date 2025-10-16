# 🚀 Guia Rápido - Sistema de Lembretes

## ⚡ Começando em 5 Minutos

### 1. Já está configurado! ✅

O sistema já foi integrado no seu app. Basta rodar:

```bash
npm start
```

### 2. Acesse as Configurações

#### Pelo Profile:
1. Abra o app
2. Navegue até a tela **Profile**
3. Toque em **"Configurar Lembretes"** (botão verde)

#### Por código:
```typescript
navigation.navigate('ReminderSettings');
```

### 3. Configure seus Lembretes

Na tela de configurações você pode:
- ✅ **Ativar/Desativar** lembretes
- 🕐 **Definir horário** de início e fim (ex: 8h - 22h)
- ⏱️ **Escolher intervalo** (30min, 1h, 2h, 3h, 4h)
- 📅 **Selecionar dias** da semana

### 4. Teste Rápido

Quer testar imediatamente? Use a tela Achievements que já tem exemplos:

```typescript
// Em qualquer screen
import { sendImmediateNotification } from '../utils/notifications';

// Enviar notificação de teste agora
await sendImmediateNotification(
  '💧 Teste de Notificação',
  'Funcionou! Sistema configurado corretamente.'
);
```

## 🎯 Casos de Uso Comuns

### Caso 1: Notificar Meta Atingida

```typescript
import { notifyGoalAchieved } from '../utils/notifications';
import { useReminders } from '../contexts/ReminderContext';

// Quando usuário bebe água e atinge porcentagem
const percentage = (currentIntake / dailyGoal) * 100;

if (percentage >= 50 && percentage < 51) {
  await notifyGoalAchieved(50);
}

if (percentage >= 100) {
  await notifyGoalAchieved(100);
}
```

### Caso 2: Verificar Status dos Lembretes

```typescript
import { useReminders } from '../contexts/ReminderContext';

function MyComponent() {
  const { config, scheduledCount, hasPermission, getNextReminderTime } = useReminders();

  return (
    <View>
      <Text>Status: {config.enabled ? 'Ativo' : 'Inativo'}</Text>
      <Text>Lembretes agendados: {scheduledCount}</Text>
      <Text>Permissão: {hasPermission ? '✅' : '❌'}</Text>
      <Text>Próximo: {getNextReminderTime()?.toLocaleTimeString()}</Text>
    </View>
  );
}
```

### Caso 3: Alterar Configuração Programaticamente

```typescript
import { useReminders } from '../contexts/ReminderContext';

function QuickSetup() {
  const { updateConfig } = useReminders();

  const setWorkSchedule = async () => {
    await updateConfig({
      startHour: 9,
      endHour: 18,
      intervalMinutes: 120,
      daysOfWeek: [1, 2, 3, 4, 5] // Seg-Sex
    });
  };

  const setWeekendSchedule = async () => {
    await updateConfig({
      startHour: 10,
      endHour: 23,
      intervalMinutes: 180,
      daysOfWeek: [0, 6] // Sáb-Dom
    });
  };

  return (
    <View>
      <Button title="Horário de Trabalho" onPress={setWorkSchedule} />
      <Button title="Horário de Fim de Semana" onPress={setWeekendSchedule} />
    </View>
  );
}
```

## 🎨 Adicionar Widget na Home

Adicione o widget de status na sua tela Home:

```tsx
// src/screens/Home.tsx
import ReminderWidget from '../components/HomeComponents/ReminderWidget';

export default function Home() {
  return (
    <ScrollView>
      {/* Seus componentes existentes */}
      
      {/* Adicione o widget */}
      <ReminderWidget />
      
      {/* Mais componentes */}
    </ScrollView>
  );
}
```

## 🔔 Testar Notificações

### Método 1: Notificação Imediata (5 segundos)
```typescript
import { scheduleNotification } from '../utils/notifications';

await scheduleNotification(
  '💧 Teste',
  'Notificação em 5 segundos',
  { seconds: 5, repeats: false }
);
```

### Método 2: Usar a Tela Achievements
A tela `Achievements.tsx` já tem botões de teste implementados:
- "Pedir Permissão"
- "Agendar em 5s"
- "Listar Agendadas"
- "Cancelar Todas"

## 📊 Monitorar Sistema

```typescript
import { 
  getScheduledNotifications,
  countWaterReminders 
} from '../utils/notifications';

// Ver todas as notificações agendadas
const all = await getScheduledNotifications();
console.log('Total:', all.length);

// Contar apenas lembretes de água
const waterReminders = await countWaterReminders();
console.log('Lembretes de água:', waterReminders);

// Ver detalhes
all.forEach(n => {
  console.log({
    id: n.identifier,
    title: n.content.title,
    trigger: n.trigger
  });
});
```

## 🐛 Debug

### Ver logs do sistema:
```typescript
// Todos os logs começam com emoji para fácil identificação
// ✅ = Sucesso
// ❌ = Erro
// 📋 = Info
// 🔄 = Processando
// ⚠️ = Aviso
```

### Resetar configurações:
```typescript
import { useReminders } from '../contexts/ReminderContext';

const { resetToDefault } = useReminders();
await resetToDefault();
```

### Limpar todas as notificações:
```typescript
import { cancelAllNotifications } from '../utils/notifications';
await cancelAllNotifications();
```

## 💡 Dicas

1. **Permissões**: O sistema pede permissão automaticamente quando necessário
2. **Persistência**: Configurações são salvas automaticamente
3. **iOS Limite**: Máximo de 64 notificações. Use intervalos maiores se necessário
4. **Testes**: Use dispositivo real, emuladores não mostram notificações
5. **Background**: Notificações funcionam mesmo com app fechado

## 🎯 Próximos Passos

1. ✅ Sistema instalado e configurado
2. 🎨 Personalize as mensagens em `WATER_REMINDER_MESSAGES`
3. 🔊 Adicione sons customizados se quiser
4. 📱 Teste em dispositivo real
5. 🚀 Lance seu app!

## ❓ FAQ

**P: As notificações funcionam no emulador?**
R: Não, apenas em dispositivos reais.

**P: Como mudar as mensagens dos lembretes?**
R: Edite o array `WATER_REMINDER_MESSAGES` em `src/utils/notifications.ts`

**P: Posso adicionar sons customizados?**
R: Sim! Veja seção "Sons Personalizados" na documentação completa.

**P: Quantos lembretes posso agendar?**
R: iOS: 64 | Android: Ilimitado

**P: As notificações funcionam com o app fechado?**
R: Sim! São notificações locais gerenciadas pelo sistema operacional.

---

**Divirta-se codificando! 💧🚀**
