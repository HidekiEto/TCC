import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

type DayItem = {
  id: string;
  week: string;
  date: number;
};

export default function WeekDays() {
  const [selectedDay, setSelectedDay] = useState(
    new Date().getDate()
  );

  const generateDays = (): DayItem[] => {
    const today = new Date();
    let daysArray: DayItem[] = [];

    for (let i = -2; i <= 2; i++) {
      let date = new Date();
      date.setDate(today.getDate() + i);

      const id = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const week = date.toLocaleDateString("pt-BR", { weekday: "short" });
      const dateNumber = date.getDate();

      daysArray.push({ id, week, date: dateNumber });
    }
    return daysArray;
  };

  const days = generateDays();

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const isSelected = selectedDay === item.date;

          return (
            <TouchableOpacity 
              style={styles.dayContainer}
              onPress={() => setSelectedDay(item.date)}
            >
              {isSelected ? (
                // Componente ativo com efeito de pílula
                <View style={styles.activeContainer}>
                  <View style={styles.activePillBackground}>
                    <View style={styles.activeCircle}>
                      <Text style={styles.activeNumber}>
                        {item.date.toString().padStart(2, '0')}
                      </Text>
                    </View>
                    <View style={styles.activeLabelContainer}>
                      <Text style={styles.activeLabel}>
                        {item.week}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                // Componente inativo
                <View style={styles.inactiveContainer}>
                  <View style={styles.inactiveCircle}>
                    <Text style={styles.inactiveNumber}>
                      {item.date.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <Text style={styles.inactiveLabel}>
                    {item.week}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 0,
  },
  listContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  // Estilos para estado ativo
  activeContainer: {
    alignItems: 'center',
  },
  activePillBackground: {
    backgroundColor: '#1E3A8A',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    width: 50,
    height: 65,
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 12,
    marginTop: 25,
  },
  activeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#60A5FA',
    backgroundColor: 'white',
    position: 'absolute',
    top: -25,
    zIndex: 2,
  },
  activeNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60A5FA',
  },
  activeLabelContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  activeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize',
  },
  // Estilos para estado inativo
  inactiveContainer: {
    alignItems: 'center',
  },
  inactiveCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#60A5FA',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  inactiveNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60A5FA',
  },
  inactiveLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#60A5FA',
    textTransform: 'capitalize',
  },
});
