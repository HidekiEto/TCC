import { LineChart } from "react-native-gifted-charts";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");


const COLORS = {
  primary: "#27D5E8",
  secundary: "#084F8C", 
  gradientStart: "rgba(39, 213, 232, 0.4)",
  gradientEnd: "rgba(39, 213, 232, 0.05)",
  axis: "#666",
  grid: "#E8E8E8",
};

export const Graphic = () => {
  const data = [
    { value: 2200, label: "Seg" },
    { value: 2100, label: "Ter" },
    { value: 2400, label: "Qua" },
    { value: 2150, label: "Qui" },
    { value: 2500, label: "Sex" },
    { value: 2300, label: "Sáb" },
    { value: 2000, label: "Dom" },
  ];


  const yLabels = ["0", "500", "1000", "1500", "2000", "2500"];

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        height={220}
        width={width - 40}
        spacing={45}
        initialSpacing={20}
        hideDataPoints={false}
        dataPointsHeight={6}
        dataPointsWidth={6}
        dataPointsColor={COLORS.secundary}
        dataPointsRadius={3}
        color={COLORS.primary}
        thickness={3}
        areaChart
        startFillColor={COLORS.gradientStart}
        endFillColor={COLORS.gradientEnd}
        startOpacity={0.8}
        endOpacity={0.1}
        showXAxisIndices={false}
        xAxisLabelTextStyle={styles.axisText}
        yAxisTextStyle={styles.axisText}
        yAxisLabelTexts={yLabels}
        maxValue={2600}
        stepValue={500}
        noOfSections={5}
        hideYAxisText={false}
        yAxisThickness={0}
        xAxisThickness={0}
        horizontalRulesStyle={{
          strokeDasharray: [4, 4],
          strokeWidth: 1,
          stroke: COLORS.grid,
        }}
        hideRules={false}
        rulesLength={width - 80}
        isAnimated
        animateOnDataChange
        animationDuration={800}
        curved
        curvature={0.2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 10,
    marginTop: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  axisText: {
    fontSize: 11,
    color: COLORS.axis,
    fontWeight: '400',
  },
});
