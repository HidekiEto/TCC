/**
 * Testes para o Sistema de Notificações
 */

import {
  validateReminderConfig,
  formatReminderConfig,
  DEFAULT_REMINDER_CONFIG,
  ReminderConfig,
} from '../notifications';

describe('Sistema de Notificações', () => {
  describe('validateReminderConfig', () => {
    it('deve validar configuração padrão como válida', () => {
      expect(validateReminderConfig(DEFAULT_REMINDER_CONFIG)).toBe(true);
    });

    it('deve rejeitar horário inicial negativo', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        startHour: -1,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar horário inicial maior que 23', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        startHour: 24,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar horário final negativo', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        endHour: -1,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar horário final maior que 23', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        endHour: 24,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar quando startHour >= endHour', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        startHour: 20,
        endHour: 20,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar quando startHour > endHour', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        startHour: 22,
        endHour: 8,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar intervalo menor que 15 minutos', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        intervalMinutes: 14,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar intervalo maior que 1440 minutos (24h)', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        intervalMinutes: 1441,
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve rejeitar quando nenhum dia está selecionado', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        daysOfWeek: [],
      };
      expect(validateReminderConfig(config)).toBe(false);
    });

    it('deve aceitar configuração válida com apenas um dia', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        daysOfWeek: [1], // Segunda-feira
      };
      expect(validateReminderConfig(config)).toBe(true);
    });

    it('deve aceitar intervalo de 30 minutos', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        intervalMinutes: 30,
      };
      expect(validateReminderConfig(config)).toBe(true);
    });

    it('deve aceitar intervalo de 4 horas (240 min)', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        intervalMinutes: 240,
      };
      expect(validateReminderConfig(config)).toBe(true);
    });
  });

  describe('formatReminderConfig', () => {
    it('deve formatar configuração padrão corretamente', () => {
      const formatted = formatReminderConfig(DEFAULT_REMINDER_CONFIG);
      expect(formatted).toContain('8h - 22h');
      expect(formatted).toContain('2h');
      expect(formatted).toContain('Dom');
      expect(formatted).toContain('Seg');
      expect(formatted).toContain('Sáb');
    });

    it('deve formatar intervalo em horas quando divisível por 60', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        intervalMinutes: 180, // 3 horas
      };
      const formatted = formatReminderConfig(config);
      expect(formatted).toContain('3h');
    });

    it('deve formatar intervalo em horas e minutos quando necessário', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        intervalMinutes: 90, // 1h 30min
      };
      const formatted = formatReminderConfig(config);
      expect(formatted).toContain('1h 30min');
    });

    it('deve formatar intervalo apenas em minutos quando menor que 1 hora', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        intervalMinutes: 45,
      };
      const formatted = formatReminderConfig(config);
      expect(formatted).toContain('45min');
    });

    it('deve listar apenas os dias selecionados', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        daysOfWeek: [1, 3, 5], // Seg, Qua, Sex
      };
      const formatted = formatReminderConfig(config);
      expect(formatted).toContain('Seg');
      expect(formatted).toContain('Qua');
      expect(formatted).toContain('Sex');
      expect(formatted).not.toContain('Dom');
      expect(formatted).not.toContain('Ter');
    });

    it('deve formatar horários com dois dígitos', () => {
      const config: ReminderConfig = {
        ...DEFAULT_REMINDER_CONFIG,
        startHour: 9,
        endHour: 21,
      };
      const formatted = formatReminderConfig(config);
      expect(formatted).toContain('9h - 21h');
    });
  });

  describe('DEFAULT_REMINDER_CONFIG', () => {
    it('deve ter valores padrão sensatos', () => {
      expect(DEFAULT_REMINDER_CONFIG.enabled).toBe(true);
      expect(DEFAULT_REMINDER_CONFIG.startHour).toBe(8);
      expect(DEFAULT_REMINDER_CONFIG.endHour).toBe(22);
      expect(DEFAULT_REMINDER_CONFIG.intervalMinutes).toBe(120);
      expect(DEFAULT_REMINDER_CONFIG.daysOfWeek).toHaveLength(7);
    });

    it('deve incluir todos os dias da semana', () => {
      expect(DEFAULT_REMINDER_CONFIG.daysOfWeek).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('deve ser uma configuração válida', () => {
      expect(validateReminderConfig(DEFAULT_REMINDER_CONFIG)).toBe(true);
    });
  });

  describe('Cenários de Uso Real', () => {
    it('deve validar configuração típica de trabalho (9h-18h)', () => {
      const config: ReminderConfig = {
        enabled: true,
        startHour: 9,
        endHour: 18,
        intervalMinutes: 120,
        daysOfWeek: [1, 2, 3, 4, 5], // Seg-Sex
      };
      expect(validateReminderConfig(config)).toBe(true);
    });

    it('deve validar configuração para dormir tarde (14h-2h)', () => {
      const config: ReminderConfig = {
        enabled: true,
        startHour: 14,
        endHour: 23,
        intervalMinutes: 90,
        daysOfWeek: [0, 6], // Fim de semana
      };
      expect(validateReminderConfig(config)).toBe(true);
    });

    it('deve validar configuração minimalista (apenas 1 lembrete/dia)', () => {
      const config: ReminderConfig = {
        enabled: true,
        startHour: 8,
        endHour: 9,
        intervalMinutes: 60,
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      };
      expect(validateReminderConfig(config)).toBe(true);
    });
  });
});
