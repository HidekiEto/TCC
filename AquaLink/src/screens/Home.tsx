
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { useState } from 'react';

import { CircularLiquidProgress} from '../components/HomeComponents/WaterCircle';
import { BottomMenu } from '../components/BottomNavigation';

import WeekDays from '../components/HomeComponents/CalendarStrip';
import ModalComponent from '../components/HomeComponents/Modal';
import { LiquidGauge } from '../components/HomeComponents/LuiquidGauge';

export default function Home() {
  const [waterValue, setWaterValue] = useState(0);

  const waterIncrement = () => {
    setWaterValue((prev) => Math.min(prev + 30, 100));
  };

  return (
    <PaperProvider>
      <StatusBar backgroundColor="white" barStyle="light-content" />

      <View className="flex-1 w-full p-5 bg-white shadow-md elevation-5">
      
        <View className="flex-row items-start">
          <View>
            <Text className="text-2xl font-bold">Olá, Samuel,</Text>
            <Text className="text-base mb-5">Bem vindo ao Aqualink.</Text>
          </View>
          <View className="ml-auto bg-[#27D5E8] rounded-full w-10 h-10 justify-center items-center">
            <FontAwesome name="bell" size={20} color="white" />
          </View>
        </View>

       
        <WeekDays/> 

      
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-extrabold text-[#084F8C]">
            Meta diária
          </Text>

          <LiquidGauge value={waterValue} />

          <TouchableOpacity
            className="mt-5 p-2 bg-[#084F8C] rounded-2xl w-4/5 shadow-md elevation-5"
            onPress={waterIncrement}
          >
            <Text className="text-white text-base font-bold text-center font-poppins">
              Adicionar Água
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between gap-x-2   px-4 ">
  <ModalComponent 
    title="Status da Bateria"
    icon="battery-70"
    info1="Bateria: 53%"
    info2="Água restante: 160ml"
    buttonClassName="bg-white rounded-2xl w-[60%] h-[50%] shadow-lg shadow-black/40 justify-center items-center "
  />
  
  <ModalComponent 
    title="Lembretes"
    icon="bell"
    info1="12:30"
    info2="16:30"
    buttonClassName="bg-blue-200 rounded-2xl w-[40%] h-[50%] shadow-lg shadow-black/40 justify-center items-center "
  />
</View>

      </View>

      <BottomMenu />
    </PaperProvider>
  );
}
