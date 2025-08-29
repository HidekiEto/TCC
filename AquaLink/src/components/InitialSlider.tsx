import Slider from 'react-native-app-intro-slider';
import { View, Text, TouchableOpacity } from 'react-native';
import renderSlides from '../components/RenderSlides';
import Title from '../components/Title';

import { useFonts } from "expo-font";

interface SlidesProps {
  onDone: () => void; 
}

const slides = [
  {
    key: '1',
    component: <Title />,
    backgroundColor: '#3498db',
    text: 'A garrafa inteligente 100% brasileira.',
    image: require('../assets/bottle.png'),
  },
  {
    key: '2',
    component: <Title />,
    text: 'Muito menos consumo.',
    backgroundColor: '#3498db',
    topContent: true,
  },
  {
    key: '3',
    component: <Title />,
    text: 'Muito mais praticidade.',
    backgroundColor: '#3498db',
    topContent: true,
  },
];

export default function Slides({ onDone }: SlidesProps) {
  const [fontsLoaded] = useFonts({
    latoRegular: require("../assets/fonts/Lato-Regular.ttf"),
  });

  const renderDoneButton = () => (
    <View className="bottom-24 right-[100%]  w-full flex items-center justify-center">
      <TouchableOpacity
        className="bg-[#084F8C] rounded-full px-8 py-3 items-center justify-center"
        onPress={onDone}
      >
        <Text className="text-white text-lg font-light">Acessar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Slider
      renderItem={renderSlides}
      data={slides}
      showNextButton={false}
      showDoneButton={true}
      onDone={onDone}
      dotStyle={{
        marginBottom: 24,
        backgroundColor: '#084F8C',
        width: 15,
        height: 15,
        borderRadius: 20,
      }}
      activeDotStyle={{
        marginBottom: 24,
        backgroundColor: 'white',
        width: 15,
        height: 15,
        borderRadius: 20,
      }}
      renderDoneButton={renderDoneButton}
    />
  );
}

