
import React from 'react';
import { BarChart } from "react-native-gifted-charts";
import { View, Text, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { calcularMetaSemanalAgua, useConsumoUltimasSemanas } from '../Goals/WeeklyIntake';

export const BarChartComponent: React.FC<{ userData?: any }> = ({ userData }) => {
  const { width, height } = Dimensions.get('window');
  const consumoSemanal = useConsumoUltimasSemanas(userData?.uid);

  const metaSemanal = userData ? calcularMetaSemanalAgua(userData) : 0;


  console.log('[BarChart] ConsumoSemanal:', consumoSemanal);
  console.log('[BarChart] MetaSemanal:', metaSemanal);

  const renderTitle = () => (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <Text
        style={{
          color: '#082862',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        <Ionicons name="water" size={20} color="#082862" />
        Relatório de Hidratação
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 15,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          
          <Text
            style={{
              color: '#666',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            Meta semanal: <Text style={{ color: '#084F8C', fontWeight: 'bold' }}>{metaSemanal ? `${metaSemanal.toFixed(0)} ML` : '--'}</Text>
          </Text>
        </View>
      </View>
    </View>
  );

 
  const barData = consumoSemanal.map((v: number, i: number) => {
    const litros = v / 1000;
    return {
      value: litros,
      label: `Semana ${i + 1}`,
      frontColor: '#177AD5',
      topLabelComponent: () => (
        <Text style={{ color: '#177AD5', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
          {`${Math.round(litros)}L`}
        </Text>
      ),
    };
  });

  return (
     <View style={{
          paddingBottom: 30,
          backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginVertical: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              width: '100%',
        }}>
            {renderTitle()}
            <BarChart
            showFractionalValues
            showYAxisIndices
            // hideRules
            noOfSections={3}
            maxValue={30}
            data={barData}
            barWidth={width * 0.08}
            spacing={width * 0.05}
            side="right"
            height={height * 0.25}
            yAxisLabelTexts={["0L", "10L", "20L", "30L"]}
            width={width * 0.7}
            xAxisLabelTextStyle={{ fontSize: Math.round(width * 0.028), color: '#000', width: width * 0.15, textAlign: 'center', transform: [{ rotate: '-20deg' }] }}
            />
         
        </View>
  );
}