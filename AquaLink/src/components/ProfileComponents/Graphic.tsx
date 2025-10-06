import { LineChart } from "react-native-gifted-charts";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#27D5E8",
  secundary: "#084F8C", 
  gradientStart: "rgba(39, 213, 232, 0.4)",
  gradientEnd: "rgba(39, 213, 232, 0.05)",
  axis: "#666",
  grid: "#E8E8E8",
};

export const Graphic = ({ data = [], metaDiaria = 0 }) => {

  
  const diasSemanaCompletos = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  const hoje = new Date();
  const ultimosDias = Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() - (6 - i)); 
    return {
      diaSemana: diasSemanaCompletos[dia.getDay()],
      diaNumero: dia.getDate(),
      mes: dia.getMonth(),
      ano: dia.getFullYear(),
      timestamp: dia.toDateString()
    };
  });

  const chartData = ultimosDias.map((diaInfo, i) => {
    let valor = 0;
    
 
    if (data[i] && typeof data[i] === 'object' && 'value' in (data[i] as any)) {
      valor = (data[i] as any).value || 0;
    } 
   
    else if (data[i] !== undefined && typeof data[i] === 'number') {
      valor = data[i] as number;
    }
    
    return {
      value: valor,
      label: diaInfo.diaSemana,
      dataLabel: `${diaInfo.diaNumero}/${diaInfo.mes + 1}`
    };
  });


  
  const valoresData = data.map(d => typeof d === 'number' ? d : (d as any)?.value || 0);
  const maxY = Math.max(metaDiaria, ...valoresData, 2500);
  const step = Math.ceil(maxY / 5 / 100) * 100;
  const yLabels = Array.from({ length: 6 }, (_, i) => String(i * step));

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        height={height * 0.28}
        width={width * 0.92}
        spacing={width * 0.11}
        initialSpacing={width * 0.045}
        hideDataPoints={false}
        dataPointsHeight={height * 0.008}
        dataPointsWidth={height * 0.008}
        dataPointsColor={COLORS.secundary}
        dataPointsRadius={height * 0.004}
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
        maxValue={maxY}
        stepValue={step}
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
        rulesLength={width * 0.85}
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
