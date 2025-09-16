import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from "react-native-animatable";
import Title from './Title';

const { width, height } = Dimensions.get('window');

interface SlidesProps {
  onDone: () => void; 
  onNavigateToWelcome: () => void;
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

const slides = [
  {
    key: '1',
    title: <Title />,
    text: 'A garrafa inteligente 100%\nbrasileira.',
    image: require('../assets/bottle.png'),
    type: 'normal',
  },
  {
    key: '2',
    title: <Title />,
    text: 'Muito menos consumo.',
    image: null,
    type: 'normal',
  },
  {
    key: '3',
    title: <Title />,
    text: 'Muito mais praticidade.',
    image: null,
    type: 'normal',
  },
  {
    key: '4',
    title: null,
    text: null,
    image: null,
    type: 'welcome',
  },
];

export default function Slides({ onDone, onNavigateToWelcome, onNavigateToRegister, onNavigateToLogin }: SlidesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideTransitionAnim = useRef(new Animated.Value(0)).current;
  const [hasReachedSlide4, setHasReachedSlide4] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

 
  useEffect(() => {
    if (hasReachedSlide4) {
      setCurrentIndex(3);
     
      slideTransitionAnim.setValue(1);
      scrollViewRef.current?.scrollTo({
        x: width * 3,
        animated: false
      });
    }
  }, [hasReachedSlide4]);


  const forceStayOnSlide4 = () => {
    if (hasReachedSlide4) {
      scrollViewRef.current?.scrollTo({
        x: width * 3,
        animated: false
      });
      setCurrentIndex(3);
     
      slideTransitionAnim.setValue(1);
    }
  };

  const handleScroll = (event: any) => {
    if (isTransitioning) return;
    
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    
   
    if (index === 3 && !hasReachedSlide4) {
      setHasReachedSlide4(true);
      
      slideTransitionAnim.setValue(1);
    }
    
   
    if (hasReachedSlide4) {
      
      if (scrollPosition < width * 3) {
        forceStayOnSlide4();
        return;
      }
      
      if (index !== 3) {
        forceStayOnSlide4();
        return;
      }
      setCurrentIndex(3);
      return;
    }
    
    const slide3Position = width * 2;
    const slide4Position = width * 3;
    
    if (scrollPosition >= slide3Position && scrollPosition <= slide4Position) {
      const progress = Math.min((scrollPosition - slide3Position) / width, 1);
      slideTransitionAnim.setValue(progress);
      
      if (progress >= 0.9 && index === 3) {
        console.log("chegou no Welcome slide");
      }
    }
    
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

  const renderSlide = (item: any, index: number) => {
    if (item.type === 'welcome') {
      return (
        <View key={item.key} style={styles.slide}>
          <LinearGradient
            colors={["#084F8C", "#27D5E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.slideGradient}
          >
            <Animated.View 
              style={[
                styles.transitionOverlay,
                {
                  opacity: hasReachedSlide4 ? 0 : slideTransitionAnim.interpolate({
                    inputRange: [0, 0.3, 1],
                    outputRange: [1, 0.7, 0],
                    extrapolate: 'clamp',
                  }),
                }
              ]}
              pointerEvents="none"
            />
            
            <Animated.View 
              style={[
                styles.welcomeContent,
                {
                  transform: hasReachedSlide4 ? [] : [{
                    translateY: slideTransitionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                      extrapolate: 'clamp',
                    })
                  }, {
                    translateX: slideTransitionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                      extrapolate: 'clamp',
                    })
                  }],
                  opacity: hasReachedSlide4 ? 1 : slideTransitionAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.5, 1],
                    extrapolate: 'clamp',
                  }),
                }
              ]}
              pointerEvents="box-none"
            >
              <Animatable.View 
                style={styles.welcomeHeaderContainer}
                animation={currentIndex === 3 ? "fadeInLeft" : undefined}
                duration={1000}
                delay={200}
              >
                <Text style={styles.welcomeTitle}>Bem-vindo!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Sua experiência com{'\n'}
                  <Text style={styles.aquaLinkText}>AquaLink</Text> acaba de começar.
                </Text>
              </Animatable.View>

              <View 
                style={styles.welcomeButtonContainer}
              >
                <TouchableOpacity
                  onPress={() => {
                    console.log("🚀 Navegando para tela de Registro...");
                    onNavigateToRegister();
                  }}
                  style={styles.welcomePrimaryButton}
                  activeOpacity={0.7}
                >
                  <Animatable.Text 
                    style={styles.welcomePrimaryButtonText}
                    animation={currentIndex === 3 ? "fadeInLeft" : undefined}
                    duration={1000}
                    delay={500}
                  >
                    Nova Conta
                  </Animatable.Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    console.log("🔑 Navegando para tela de Login...");
                    onNavigateToLogin();
                  }}
                  style={styles.welcomeSecondaryButton}
                  activeOpacity={0.7}
                >
                  <Animatable.Text 
                    style={styles.welcomeSecondaryButtonText}
                    animation={currentIndex === 3 ? "fadeInLeft" : undefined}
                    duration={1000}
                    delay={700}
                  >
                    Já possuo uma Conta
                  </Animatable.Text>
                </TouchableOpacity>
              </View>

              <Animatable.View 
                style={styles.welcomeImageContainer}
                animation={currentIndex === 3 ? "fadeInLeft" : undefined}
                duration={1200}
                delay={600}
              >
                <Image
                  source={require("../assets/fitFemale.png")}
                  resizeMode="contain"
                  style={styles.welcomeImage}
                />
              </Animatable.View>
            </Animated.View>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View key={item.key} style={styles.slide}>
        <LinearGradient
          colors={["#084F8C", "#27D5E8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.slideGradient}
        >
          <Animated.View 
            style={[
              styles.slideContent,
              index === 2 ? {
                opacity: slideTransitionAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.8, 0.3],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  scale: slideTransitionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.95],
                    extrapolate: 'clamp',
                  })
                }]
              } : {}
            ]}
          >
            {index === 0 ? (
              <Animatable.View 
                style={styles.titleContainer}
                animation="fadeInUp"
                duration={1000}
                delay={300}
              >
                {item.title}
              </Animatable.View>
            ) : (
              <Animatable.View 
                style={styles.titleContainer}
                animation="fadeInUp"
                duration={800}
                delay={200}
              >
                {item.title}
              </Animatable.View>
            )}
            
            {index === 0 ? (
              <Animatable.Text 
                style={styles.slideText}
                animation="fadeInUp"
                duration={1000}
                delay={500}
              >
                {item.text}
              </Animatable.Text>
            ) : (
              <Animatable.Text 
                style={styles.slideText}
                animation="fadeInUp"
                duration={800}
                delay={400}
              >
                {item.text}
              </Animatable.Text>
            )}
            
            {item.image && (
              index === 0 ? (
                <Animatable.View 
                  style={styles.imageContainer}
                  animation="fadeInUp"
                  duration={1200}
                  delay={700}
                >
                  <Image 
                    source={item.image} 
                    style={styles.slideImage} 
                    resizeMode="contain" 
                  />
                </Animatable.View>
              ) : (
                <Animatable.View 
                  style={styles.imageContainer}
                  animation="fadeInUp"
                  duration={800}
                  delay={600}
                >
                  <Image 
                    source={item.image} 
                    style={styles.slideImage} 
                    resizeMode="contain" 
                  />
                </Animatable.View>
              )
            )}
            
            {index === 2 && (
              <Animatable.Text 
                style={[
                  styles.swipeHintText,
                  {
                    opacity: slideTransitionAnim.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [0.8, 0.4, 0],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
                delay={1000}
              >
                Deslize para iniciar a experiência →
              </Animatable.Text>
            )}
          </Animated.View>
          
          <View style={styles.paginationContainer}>
            {Array.from({ length: 4 }, (_, dotIndex) => renderDot(dotIndex))}
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEnabled={!hasReachedSlide4} // Desabilita o scroll quando chegou no slide 4
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={{ width: width * 4 }}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
    </Animated.View>
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
    height: '100%',
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
    width: width * 1,
    height: width * 1,
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
    bottom: "30%",
    left: 0,
    right: 0,
    alignItems: 'center',    
    
  },
  doneButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 0,
    borderColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'transparent'
  },
  swipeHintText: {
    position: 'absolute',
    bottom: 140,
    color: 'white',
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.8,
    textAlign: 'center',
  },
  // Estilos do Welcome
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  welcomeHeaderContainer: {
    alignItems: 'flex-start',
    marginTop: height * 0.12,
    marginBottom: height * 0.05,
    paddingLeft: 10,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '300',
    lineHeight: 22,
  },
  aquaLinkText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  welcomeButtonContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
    zIndex: 10,
    elevation: 10,
  },
  welcomePrimaryButton: {
    backgroundColor: '#27D5E8',
    width: width * 0.75,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 15,
  },
  welcomePrimaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  welcomeSecondaryButton: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingBottom: 3,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30,
    zIndex: 15,
  },
  welcomeSecondaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  welcomeImageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0,
  },
  welcomeImage: {
    width: width * 2,
    height: width * 0.8,
  },
  transitionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#084F8C',
    zIndex: 1,
  },
});
