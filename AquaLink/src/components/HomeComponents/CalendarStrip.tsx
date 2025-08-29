import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

type DayItem = {
  id: string;
  week: string;
};

export default function WeekDays() {
  const [selectedDay, setSelectedDay] = useState(
    new Date().getDate().toString()
  );

  const generateDays = (): DayItem[] => {
    const today = new Date();
    let daysArray: DayItem[] = [];

    for (let i = -2; i <= 2; i++) {
      let date = new Date();
      date.setDate(today.getDate() + i);

      const id = date.getDate().toString();
      const week = date.toLocaleDateString("pt-BR", { weekday: "short" });

      daysArray.push({ id, week });
    }
    return daysArray;
  };

  const days = generateDays();

  return (
    <View className="flex-row justify-center mt-5">
      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedDay === item.id;

          return (
            <TouchableOpacity
              className={`items-center justify-center mx-3 px-2 py-4 rounded-full border w-14 h-14
              ${isSelected ? "bg-blue-700 border-blue-700" : "border-blue-700"}`}
              onPress={() => setSelectedDay(item.id)}
            >
              <Text
                className={`text-base font-bold 
                ${isSelected ? "text-white" : "text-blue-700"}`}
              >
                {item.id}
              </Text>
              <Text
                className={`text-sm 
                ${isSelected ? "text-white" : "text-blue-700"}`}
              >
                {item.week}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
