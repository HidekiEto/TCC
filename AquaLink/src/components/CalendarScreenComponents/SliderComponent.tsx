import React from 'react';
import Slider from 'react-native-app-intro-slider';
import { View, StyleSheet } from 'react-native';
import { RenderComponentSlides } from './RenderComponentSlides';
import { useAppFonts } from '../../hooks/useAppFonts';

interface Slide {
  key: string;
  text?: string;
  info1?: string;
  info2?: string;
  backgroundColor?: string;
}

const slides: Slide[] = [
  {
    key: '1',
    backgroundColor: '#3498db',
    text: 'Metas Alcançadas',
    info1: 'Você alcançou sua meta em: 2 dos 31 dias',
    info2: 'Água ingerida: 12,5L',
  },
  {
    key: '2',
    text: 'Água ingerida',
    backgroundColor: '#3498db',
    info1: 'Você ingeriu um total de 12,5L de água este mês!',
  },
];

export default function SliderComponent() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) return null;

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
