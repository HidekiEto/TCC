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
            <View
              style={[
                styles.dayButton,
                isSelected ? styles.selectedButton : styles.unselectedButton
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isSelected ? styles.selectedText : styles.unselectedText
                ]}
              >
                {item.date}
              </Text>
              <Text
                style={[
                  styles.dayWeek,
                  isSelected ? styles.selectedText : styles.unselectedText
                ]}
              >
                {item.week}
              </Text>
            </View>
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
    marginBottom: 10,
  },
  listContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    width: 50,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedButton: {
    backgroundColor: '#084F8C',
    borderColor: '#084F8C',
  },
  unselectedButton: {
    backgroundColor: 'white',
    borderColor: '#084F8C',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dayWeek: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: '#084F8C',
  },
});
