import { LineChart } from "react-native-gifted-charts";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// 🎨 Paleta de cores centralizada
const COLORS = {
  primary: "#27D5E8",
  secundary: "#084F8C",
  gradientStart: "rgba(39, 213, 232, 0.6)",
  gradientEnd: "rgba(203, 241, 250, 0.2)",
  axis: "#555",
  grid: "#E5E5E5",
};

export const Graphic = () => {
  const data = [
    { value: 2450, label: "Seg" },
    { value: 2300, label: "Ter" },
    { value: 2500, label: "Qua" },
    { value: 2300, label: "Qui" },
    { value: 2600, label: "Sex" },
    { value: 2400, label: "Sáb" },
    { value: 2200, label: "Dom" },
  ];

  // Labels do eixo Y
  const yLabels = ["500", "1000", "1500", "2000", "2500"];

  return (
    <View style={styles.container}>
     <LineChart
  data={data}
  height={240}
  width={width - 32}
  spacing={(width - 32) / data.length}
  initialSpacing={15}
  hideDataPoints={false}
  dataPointsHeight={7}
  dataPointsWidth={7}
  dataPointsColor={COLORS.secundary}
  color={COLORS.primary}
  areaChart
  startFillColor={COLORS.gradientStart}
  endFillColor={COLORS.gradientEnd}
  startOpacity={1}
  endOpacity={0.3}
  showXAxisIndices
  xAxisLabelTextStyle={styles.axisText}
  yAxisTextStyle={styles.axisText}
  yAxisLabelTexts={yLabels}
  maxValue={2500}  
  
  stepValue={500}   
  horizontalRulesStyle={{
    strokeDasharray: [5, 5],
    strokeWidth: 1,
    stroke: COLORS.grid,
  }}
  hideRules={false}
  isAnimated
  animateOnDataChange
  animationDuration={1200}
  scrollAnimation
/>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  axisText: {
    fontSize: 12,
    color: COLORS.axis,
  },
});
