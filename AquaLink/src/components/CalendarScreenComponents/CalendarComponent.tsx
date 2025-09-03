import React, { useState } from 'react';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ],
  monthNamesShort: [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez'
  ],
  dayNames: [
    'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'
  ],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

const CalendarComponent: React.FC = () => {
  const [selected, setSelected] = useState<string>('');

  return (
    <Calendar
      theme={{
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#1081C7',
        selectedDayBackgroundColor: '#1081C7',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#1bf7ffff',
        arrowColor: '#1081C7',
        monthTextColor: '#000000',
        textDayFontWeight: '500',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '600',
        textMonthFontSize: 20,
        textMonthFontFamily: "poppinsRegular",
        
      }}
      onDayPress={(day: DateData) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: { selected: true, disableTouchEvent: true }
      }}
    />
  );
};

export default CalendarComponent;
