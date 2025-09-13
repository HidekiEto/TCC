// RenderComponentSlides.tsx
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

interface SlideItem {
  key: string;
  text?: string;
  info1?: string;
  info2?: string;
}

interface RenderComponentSlidesProps {
  item: SlideItem;
}

const { width } = Dimensions.get("window");

export const RenderComponentSlides: React.FC<RenderComponentSlidesProps> = ({ item }) => {
  const gradientColors: LinearGradientProps["colors"] =
    item.key === "2" ? 
          ["#3498db", "white", "#3498db"] :
          ["#1DBF84", "white", "#1DBF84"];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.slideCard,
          {
            borderColor: item.key === "2" ? "#3498db" : "#1DBF84",
          }
        ]}
      > 
        <Text 
          style={[
            styles.slideTitle,
            { color: item.key === "2" ? "#3498db" : "#1dbf84" }
          ]}
        >
          {item.text}
        </Text>
        
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientLine}
        />
        
        {item.info1 && (
          <Text
            style={[
              styles.slideInfo,
              { color: item.key === "2" ? "#3498db" : "#1dbf84" }
            ]}
          >
            {item.info1}
          </Text>
        )}

        {item.info2 && (
          <Text
            style={[
              styles.slideInfo,
              { color: item.key === "2" ? "#3498db" : "#1dbf84" }
            ]}
          >
            {item.info2}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width, 
    height: 140, // Altura fixa em vez de flex
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  slideCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    width: width * 0.85, 
    height: 120,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  slideTitle: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gradientLine: {
    height: 1,
    width: '80%',
    marginVertical: 8,
  },
  slideInfo: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
});
