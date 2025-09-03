import Slider from 'react-native-app-intro-slider';
import { View, Text, TouchableOpacity } from 'react-native';
import renderSlides from '../components/RenderSlides';
import Title from '../components/Title';

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
  const renderDoneButton = () => (
    <View className=" -translate-x-1/2 -translate-y-1/2 bottom-20 ">
      <TouchableOpacity
        className="border-b border-white px-6 py-3"
        onPress={onDone}
      >
        <Text className="text-white font-latoRegular text-base">
          Iniciar Experiência
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-blue-600">
      <Slider
        renderItem={renderSlides}
        data={slides}
        showNextButton={false}
        showDoneButton={true}
        onDone={onDone}
        dotStyle={{
          marginBottom: 50, // distância do botão
          backgroundColor: '#084F8C',
          width: 15,
          height: 15,
          borderRadius: 20,
        }}
        activeDotStyle={{
          marginBottom: 50,
          backgroundColor: 'white',
          width: 15,
          height: 15,
          borderRadius: 20,
        }}
        renderDoneButton={renderDoneButton}
      />
    </View>
  );
}
