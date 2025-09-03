import React from 'react';
import Slider from 'react-native-app-intro-slider';
import { View } from 'react-native';
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
      <View className="flex-1 flex-row justify-center ">
        {slides.map((slide, i) => {
          const dotColor = slide.key === '2' ? '#3498db' : '#1DBF84';
          const isActive = i === activeIndex;

          return (
            <View
              key={slide.key}
              className="w-5 h-5 rounded-full mx-1 "
              style={{
                backgroundColor: isActive ? dotColor : 'white',
                borderWidth: isActive ? 0 : 1,
                borderColor: isActive ? 'transparent' : dotColor,
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 justify-center items-center top-[5%]">
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
