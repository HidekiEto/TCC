import React from 'react';
import { BarChart } from "react-native-gifted-charts";
import { View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const BarChartComponent = () => {
    const barData = [
        // Semana 1
        {
          value: 15,
          label: 'Semana 1',
          spacing: 2,
          labelWidth: 70,
          labelTextStyle: {color: 'gray'},
          frontColor: '#29EBD5',
          sideColor: '#20D0BC',
          topColor: '#4EF0E0',
        },
        {value: 12, frontColor: '#082862', sideColor: '#061B4A', topColor: '#1C3A75'},
        // Semana 2
        {
          value: 18,
          label: 'Semana 2',
          spacing: 2,
          labelWidth: 70,
          labelTextStyle: {color: 'gray'},
          frontColor: '#29EBD5',
          sideColor: '#20D0BC',
          topColor: '#4EF0E0',
        },
        {value: 16, frontColor: '#082862', sideColor: '#061B4A', topColor: '#1C3A75'},
        // Semana 3
        {
          value: 14,
          label: 'Semana 3',
          spacing: 2,
          labelWidth: 70,
          labelTextStyle: {color: 'gray'},
          frontColor: '#29EBD5',
          sideColor: '#20D0BC',
          topColor: '#4EF0E0',
        },
        {value: 13, frontColor: '#082862', sideColor: '#061B4A', topColor: '#1C3A75'},
        // Semana 4
        {
          value: 17,
          label: 'Semana 4',
          spacing: 2,
          labelWidth: 70,
          labelTextStyle: {color: 'gray'},
          frontColor: '#29EBD5',
          sideColor: '#20D0BC',
          topColor: '#4EF0E0',
        },
        {value: 19, frontColor: '#082862', sideColor: '#061B4A', topColor: '#1C3A75'},
    ];

    const renderTitle = () => {
        return(
          <View style={{alignItems: 'center', marginTop: 10}}>
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: '#29EBD5',
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  width: 80,
                  height: 16,
                  color: '#666',
                  fontSize: 12,
                }}>
                Meta Semanal
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: '#082862',
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  width: 80,
                  height: 16,
                  color: '#666',
                  fontSize: 12,
                }}>
                Desempenho
              </Text>
            </View>
          </View>
        </View>
        )
    }

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
            hideRules
            noOfSections={4}
            maxValue={20}
            data={barData}
            barWidth={25}
            spacing={15}
            isThreeD 
            side="right"
            height={180}
            yAxisLabelSuffix=" L"
            />
        </View>
    );
}