import React from 'react';
import Slider from 'react-native-app-intro-slider';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { RenderComponentSlides } from './RenderComponentSlides';
import { useAppFonts } from '../../hooks/useAppFonts';
import { useCalendarContext } from '../../hooks/useCalendarContext';
import dayjs from 'dayjs';

const { width, height } = Dimensions.get('window');

interface Slide {
  key: string;
  text?: string;
  info1?: string;
  backgroundColor?: string;
}

export default function SliderComponent() {
  const fontsLoaded = useAppFonts();
  const { diasMetaAlcancada, totalAguaMes, loading } = useCalendarContext();

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#27D5E8" />
      </View>
    );
  }

  const mesAtual = dayjs().format('MMMM');
  const diasNoMes = dayjs().daysInMonth();
  
  const totalLitros = (totalAguaMes / 1000).toFixed(1);

  const slides: Slide[] = [
    {
      key: '1',
      backgroundColor: '#3498db',
      text: 'Metas Alcançadas',
      info1: `Você alcançou sua meta em: ${diasMetaAlcancada} dos ${diasNoMes} dias`,
    },
    {
      key: '2',
      text: 'Água ingerida',
      backgroundColor: '#3498db',
      info1: `Você ingeriu um total de ${totalLitros}L de água este mês!`,
    },
  ];

  const renderItem = ({ item }: { item: Slide }) => {
    return <RenderComponentSlides item={item} />;
  };

  const renderPagination = (activeIndex: number) => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((slide, i) => {
          const dotColor = slide.key === '2' ? '#3498db' : '#1DBF84';
          const isActive = i === activeIndex;

          return (
            <View
              key={slide.key}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: isActive ? dotColor : 'white',
                  borderWidth: isActive ? 0 : 1,
                  borderColor: isActive ? 'transparent' : dotColor,
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Slider
        renderItem={renderItem}
        data={slides}
        showNextButton={false}
        showDoneButton={false}
        renderPagination={renderPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingContainer: {
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
  },
});
