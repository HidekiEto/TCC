import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function WeekDays() {
  const [selectedDay, setSelectedDay] = useState("04");

  const days = [
    { id: "02", week: "Qua" },
    { id: "03", week: "Qui" },
    { id: "04", week: "Sex" },
    { id: "05", week: "Sab" },
    { id: "06", week: "Dom" },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedDay === item.id;
          return (
            <TouchableOpacity
              style={[styles.dayContainer, isSelected && styles.daySelected]}
              onPress={() => setSelectedDay(item.id)}
            >
              <Text style={[styles.dayNumber, isSelected && styles.textSelected]}>
                {item.id}
              </Text>
              <Text style={[styles.weekDay, isSelected && styles.textSelected]}>
                {item.week}
              </Text>
            </TouchableOpacity>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#1565C0",
    width: 60,
    height: 60
  },
  daySelected: {
    backgroundColor: "#1565C0",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1565C0",
  },
  weekDay: {
    fontSize: 14,
    color: "#1565C0",
  },
  textSelected: {
    color: "#fff",
  },
});
