import React, { useState } from 'react';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
        textSectionTitleColor: '#1976D2', 
        selectedDayBackgroundColor: '#1976D2',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#27D5E8', 
        arrowColor: '#1976D2',
        monthTextColor: '#333333',
        dayTextColor: '#333333',
        textDisabledColor: '#cccccc',
        textDayFontWeight: '500',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '600',
        textMonthFontSize: 20,
        textDayFontSize: 16,
        textDayHeaderFontSize: 14,
        textMonthFontFamily: "Poppins-Regular",
      
        
      }}
      onDayPress={(day: DateData) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: { 
          selected: true, 
          disableTouchEvent: true,
          selectedColor: '#1976D2',
        }
      }}

    />
  );
};

export default CalendarComponent;
