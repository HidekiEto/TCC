import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { area, scaleLinear } from "d3";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  value?: number;             // valor do progresso (0 - 100)
  size?: number;              // tamanho do círculo
  borderColor?: string;       // cor da borda ativa
  borderBgColor?: string;     // cor da borda de fundo
  waveColor?: string;         // cor da onda
  textColor?: string;         // cor do texto fora da onda
  waveTextColor?: string;     // cor do texto dentro da onda
  waveHeightScaling?: boolean;// altura da onda varia com o nível
  waveOffset?: number;        // fase inicial da onda
  textSuffix?: string;        // sufixo do texto (%, ml, pts)
  waveRiseTime?: number;      // tempo da animação da subida
  waveAnimateTime?: number;   // tempo da animação lateral da onda
  waveRise?: boolean;         // ativa animação da subida
  waveAnimate?: boolean;      // ativa animação lateral da onda
  valueCountUp?: boolean;     // anima o texto de 0 até o valor
  toFixed?: number;           // casas decimais do texto
};

export const CircularLiquidProgress = ({
  value = 50,
  size = 200,
  borderColor = "#0085FF",
  borderBgColor = "#a0a0a1",
  waveColor = "#178BCA",
  textColor = "#045681",
  waveTextColor = "#A4DBf8",
  waveHeightScaling = true,
  waveOffset = 0,
  textSuffix = "%",
  waveRiseTime = 1000,
  waveAnimateTime = 5000,
  waveRise = true,
  waveAnimate = true,
  valueCountUp = true,
  toFixed = 0,
}: Props) => {
  const radius = size / 2;
  const strokeWidth = size * 0.05;
  const font = useFont(
    require("../../assets/fonts/Roboto-Bold.ttf"),
    size * 0.25
  );

  // ===== Normalização do valor =====
  const fillPercent = Math.max(0, Math.min(100, value)) / 100;

  // ===== Configuração da onda =====
  const waveCount = 1;
  const waveLength = (radius * 2) / waveCount;
  const waveClipCount = 2 * waveCount + 1;

  const waveHeightScale = waveHeightScaling
    ? scaleLinear().range([0, 0.05, 0]).domain([0, 0.5, 1]) // máximo em 50%
    : scaleLinear().range([0.05, 0.05]).domain([0, 1]);

  const waveHeight = radius * waveHeightScale(fillPercent);

  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear()
    .range([0, waveLength * waveClipCount])
    .domain([0, 1]);

  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const clipArea = area<[number, number]>()
    .x(d => waveScaleX(d[0]))
    .y0(d =>
      waveScaleY(
        Math.sin(
          Math.PI * 2 * waveOffset * -1 +
          Math.PI * 2 * (1 - waveCount) +
          d[1] * 2 * Math.PI
        )
      )
    )
    .y1(() => radius * 2 + waveHeight * 5);

  const clipSVGString = clipArea(data)!;

  // ===== Valores animados =====
  const translateYPercent = useSharedValue(waveRise ? 0 : fillPercent);
  const translateXProgress = useSharedValue(0);
  const textValue = useSharedValue(valueCountUp ? 0 : value);

  useEffect(() => {
    // anima subida da onda
    translateYPercent.value = withTiming(fillPercent, {
      duration: waveRise ? waveRiseTime : 0,
      easing: Easing.linear,
    });

    // anima contagem do texto
    textValue.value = withTiming(value, {
      duration: valueCountUp ? waveRiseTime : 0,
      easing: Easing.out(Easing.ease),
    });
  }, [fillPercent, value]);

  useEffect(() => {
    if (waveAnimate) {
      translateXProgress.value = withRepeat(
        withTiming(waveLength * waveCount, {
          duration: waveAnimateTime,
          easing: Easing.linear,
        }),
        -1, // infinito
        false
      );
    }
  }, [waveAnimate, waveLength, waveCount]);

  // ===== Path da onda animada =====
  const wavePath = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(clipSVGString)!;
    const m = Skia.Matrix();

    m.translate(
      radius - waveLength * waveClipCount + translateXProgress.value,
      (1 - translateYPercent.value) * radius * 2
    );

    p.transform(m);
    return p;
  }, [translateXProgress, translateYPercent, clipSVGString]);

  // ===== Arco de progresso da borda =====
  const progressPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const startAngle = -Math.PI / 2;
    const sweepAngle = 2 * Math.PI * fillPercent;

    path.addArc(
      {
        x: strokeWidth / 2,
        y: strokeWidth / 2,
        width: size - strokeWidth,
        height: size - strokeWidth,
      },
      (startAngle * 180) / Math.PI,
      (sweepAngle * 180) / Math.PI
    );
    return path;
  }, [fillPercent, size, strokeWidth]);

  // ===== Texto animado =====
  const text = useDerivedValue(
    () => `${textValue.value.toFixed(toFixed)}${textSuffix}`
  );

  const textTranslateX = useDerivedValue(() => {
    const textWidth = font?.getTextWidth(text.value) ?? 0;
    return radius - textWidth / 2;
  });

  return (
    <View>
      <Canvas style={{ width: size, height: size }}>
        <Group>
          {/* Borda de fundo */}
          <Circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            color={borderBgColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />

          {/* Arco de progresso */}
          <Path
            path={progressPath}
            style="stroke"
            strokeWidth={strokeWidth}
            color={borderColor}
            strokeCap="round"
          />

          {/* Fundo do líquido com onda */}
          <Group clip={wavePath}>
            <Circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth}
              color={waveColor}
            />
          </Group>

          {/* Texto fora da onda */}
          {font && (
            <Text
              x={textTranslateX}
              y={radius + size * 0.08}
              text={text}
              font={font}
              color={textColor}
            />
          )}

          {/* Texto dentro da onda */}
          {font && (
            <Group clip={wavePath}>
              <Text
                x={textTranslateX}
                y={radius + size * 0.08}
                text={text}
                font={font}
                color={waveTextColor}
              />
            </Group>
          )}
        </Group>
      </Canvas>
    </View>
  );
};
