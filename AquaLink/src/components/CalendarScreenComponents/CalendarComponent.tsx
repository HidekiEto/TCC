import React, { useState } from 'react';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { Dimensions, ActivityIndicator, View, Text } from 'react-native';
import { useCalendarContext } from '../../hooks/useCalendarContext';

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
  const { markedDates, loading } = useCalendarContext();

  if (loading) {
    return (
      <View style={{ height: 350, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#27D5E8" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando dados...</Text>
      </View>
    );
  }

  const combinedMarkedDates = {
    ...markedDates,
    ...(selected ? {
      [selected]: {
        ...markedDates[selected],
        selected: true,
        selectedColor: markedDates[selected]?.customStyles ? '#1DBF84' : '#1976D2',
      }
    } : {})
  };

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
      markedDates={combinedMarkedDates}
      markingType={'custom'}
      enableSwipeMonths={true}
    />
  );
};

export default CalendarComponent;
