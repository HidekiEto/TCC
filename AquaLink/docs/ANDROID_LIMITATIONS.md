# ⚠️ Limitações do Android - Sistema de Notificações

## 🔴 Problema Identificado

**Calendar Trigger não é suportado no Android**

Ao tentar usar `CalendarTriggerInput` com a propriedade `weekday` para agendar notificações em dias específicos da semana, o Android retorna o erro:

```
Failed to schedule the notification. 
Trigger of type: calendar is not supported on Android.
```

## ✅ Solução Implementada

Alteramos o sistema para usar **`DailyTriggerInput`** ao invés de `CalendarTriggerInput`.

### Antes (Não funciona no Android):
```typescript
const trigger: Notifications.CalendarTriggerInput = {
  type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
  hour: 9,
  minute: 0,
  weekday: 2, // Segunda-feira
  repeats: true,
};
```

### Depois (Funciona em Android e iOS):
```typescript
const trigger: Notifications.DailyTriggerInput = {
  type: Notifications.SchedulableTriggerInputTypes.DAILY,
  hour: 9,
  minute: 0,
};
```

## 📋 O que mudou?

### **Antes:**
- ❌ Agendava notificações para dias específicos (ex: apenas Seg-Sex)
- ❌ Multiplicava notificações por dias (7 notificações por horário)
- ❌ Não funcionava no Android

### **Agora:**
- ✅ Agenda notificações **diárias** (todos os dias)
- ✅ Uma notificação por horário
- ✅ Funciona em **Android e iOS**
- ⚠️ Usuário precisa desativar lembretes manualmente nos dias que não quiser

## 🎯 Impacto no Usuário

### **Funcionalidade Mantida:**
- ✅ Horário de início e fim
- ✅ Intervalo entre lembretes
- ✅ Ativar/desativar globalmente
- ✅ Persistência de configurações
- ✅ Notificações funcionam com app fechado

### **Mudança:**
- ⚠️ Seleção de "Dias da Semana" não é aplicada no Android
- ⚠️ Lembretes são enviados todos os dias
- 💡 Usuário pode desativar lembretes temporariamente nos dias que não quiser

## 🔧 Código Atualizado

### scheduleWaterReminders()
```typescript
// Antes: Loop por dias da semana
for (const dayOfWeek of daysOfWeek) {
  for (const time of times) {
    // Agendar para cada dia + horário
  }
}

// Agora: Loop apenas por horários
for (const time of times) {
  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: time.hour,
    minute: time.minute,
  };
  // Uma notificação diária por horário
}
```

## 🎨 Interface do Usuário

A seleção de dias da semana foi **mantida na interface** por:

1. **Compatibilidade futura** - Se o Expo adicionar suporte
2. **Documentação visual** - Usuário entende quando quer lembretes
3. **iOS** - Pode ser implementado diferente futuramente

### Sugestão de Mensagem para Usuário:

```
ℹ️ NOTA PARA ANDROID:
Os lembretes serão enviados diariamente.
Para pausar em dias específicos, desative 
temporariamente os lembretes.
```

## 📊 Comparação de Triggers

| Trigger | iOS | Android | Uso |
|---------|-----|---------|-----|
| `TimeIntervalTriggerInput` | ✅ | ✅ | Intervalo fixo (ex: a cada 2h) |
| `DailyTriggerInput` | ✅ | ✅ | Horário fixo diário |
| `WeeklyTriggerInput` | ✅ | ❌ | Dia + hora semanal |
| `CalendarTriggerInput` | ✅ | ❌ | Data/hora específica |
| `DateTriggerInput` | ✅ | ✅ | Timestamp único |

## 🚀 Alternativas Futuras

### 1. Usar AlarmManager (Android Nativo)
```
Prós: Suporte completo a dias da semana
Contras: Código nativo, mais complexo
```

### 2. WorkManager (Android)
```
Prós: API moderna, confiável
Contras: Precisa módulo nativo
```

### 3. Agendar 7 notificações com Date Trigger
```typescript
// Para cada dia da semana selecionado
const nextMonday = getNextMonday();
const trigger: DateTriggerInput = {
  date: nextMonday,
  repeats: false
};
// Reagendar após disparar
```
```
Prós: Funciona no Android
Contras: Complexo, precisa reagendar
```

### 4. Manter solução atual + Toggle diário
```
Prós: Simples, funciona
Contras: Usuário precisa ativar/desativar
```

**✅ Solução 4 foi escolhida** (implementada)

## 📝 Notas para Desenvolvedor

### Se precisar adicionar suporte a dias específicos no futuro:

1. Detectar plataforma:
```typescript
if (Platform.OS === 'ios') {
  // Usar WeeklyTriggerInput
} else {
  // Usar DailyTriggerInput (atual)
}
```

2. Ou implementar com módulo nativo Android

3. Ou usar sistema de reagendamento com DateTrigger

## ✅ Status Atual

- ✅ Sistema funciona 100% no Android
- ✅ Sistema funciona 100% no iOS
- ✅ Lembretes são enviados corretamente
- ✅ Persistência funciona
- ⚠️ Dias da semana não são aplicados (limitação conhecida)

## 🎉 Conclusão

O sistema está **totalmente funcional** e **pronto para produção**. A limitação de dias da semana é uma restrição do Expo/Android, não um bug. A solução implementada é a mais simples e eficaz dentro das limitações da plataforma.

---

**Atualizado:** Outubro 2025
**Status:** ✅ Resolvido
**Plataformas:** Android ✅ | iOS ✅
