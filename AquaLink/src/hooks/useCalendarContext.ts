import { useContext } from 'react';
import { CalendarContext } from '../contexts/CalendarContext';

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendarContext deve ser usado dentro de um CalendarProvider');
  }
  return context;
};
