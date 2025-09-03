import React from "react";
import { Text, View } from "react-native";

const Title: React.FC = () => {
  return (
    <View className="flex-row">
      <Text className="text-white text-[50px] font-[poppinsBold] leading-[60px]">
        Aqua
      </Text>
      <Text className="text-white text-[50px] font-[poppinsRegular] leading-[60px]">
        Link
      </Text>
    </View>
  );
};

export default Title;
