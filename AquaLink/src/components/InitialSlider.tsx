import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Title from './Title';

const { width, height } = Dimensions.get('window');

interface SlidesProps {
  onDone: () => void; 
}

const slides = [
  {
    key: '1',
    title: <Title />,
    text: 'A garrafa inteligente 100%\nbrasileira.',
    image: require('../assets/bottle.png'),
  },
  {
    key: '2',
    title: <Title />,
    text: 'Muito menos consumo.',
    image: null,
  },
  {
    key: '3',
    title: <Title />,
    text: 'Muito mais praticidade.',
    image: null,
  },
];

export default function Slides({ onDone }: SlidesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        currentIndex === index ? styles.activeDot : styles.inactiveDot
      ]}
    />
  );

  const renderSlide = (item: any, index: number) => (
    <View key={item.key} style={styles.slide}>
      <LinearGradient
        colors={["#084F8C", "#27D5E8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.slideGradient}
      >
        <View style={styles.slideContent}>
          <View style={styles.titleContainer}>
            {item.title}
          </View>
          
          <Text style={styles.slideText}>
            {item.text}
          </Text>
          
          {item.image && (
            <View style={styles.imageContainer}>
              <Image 
                source={item.image} 
                style={styles.slideImage} 
                resizeMode="contain" 
              />
            </View>
          )}
        </View>
        
        {/* Pagination dots na parte inferior - dentro do gradiente */}
        <View style={styles.paginationContainer}>
          {slides.map((_, dotIndex) => renderDot(dotIndex))}
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Botão só aparece no último slide */}
      {currentIndex === slides.length - 1 && (
        <View style={styles.doneButtonContainer}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onDone}
          >
            <Text style={styles.doneButtonText}>
              Iniciar Experiência
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: '100%', // Força altura total
    flex: 1,
  },
  slideGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: height * 0.15,
    justifyContent: 'center',
    paddingBottom: 120,
    height: '100%',
  },
  titleContainer: {
    marginBottom: 0,
  },
  slideText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 28,
    marginBottom: 60,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  slideImage: {
    width: width * 0.6,
    height: width * 0.6,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  doneButtonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
});
