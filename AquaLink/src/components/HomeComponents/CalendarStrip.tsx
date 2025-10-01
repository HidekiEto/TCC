import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

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
    paddingHorizontal: 0,
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
 
  activeContainer: {
    alignItems: 'center',
  },
  activePillBackground: {
    backgroundColor: '#1E3A8A',
    borderTopLeftRadius: width * 0.012,
    borderTopRightRadius: width * 0.012,
    borderBottomLeftRadius: width * 0.06,
    borderBottomRightRadius: width * 0.06,
    width: width * 0.13,
    height: height * 0.08,
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: height * 0.015,
    marginTop: height * 0.03,
  },
  activeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    borderWidth: 1,
    borderColor: '#60A5FA',
    backgroundColor: 'white',
    position: 'absolute',
    top: -height * 0.03,
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

  inactiveContainer: {
    alignItems: 'center',
  },
  inactiveCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    borderWidth: 1,
    borderColor: '#60A5FA',
    backgroundColor: 'white',
    marginBottom: height * 0.01,
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
