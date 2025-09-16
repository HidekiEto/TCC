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

export type GaugeConfig = {
  minValue: number;
  maxValue: number;
  circleThickness: number;
  circleFillGap: number;
  circleColor: string;
  waveHeight: number;
  waveCount: number;
  waveRiseTime: number;
  waveAnimateTime: number;
  waveRise: boolean;
  waveHeightScaling: boolean;
  waveAnimate: boolean;
  waveColor: string;
  waveOffset: number;
  textVertPosition: number;
  textSize: number;
  valueCountUp: boolean;
  textSuffix: string;
  textColor: string;
  waveTextColor: string;
  toFixed: number;
};

function liquidFillGaugeDefaultSettings(): GaugeConfig {
  return {
    minValue: 0,
    maxValue: 100,
    circleThickness: 0.08, 
    circleFillGap: 0.02, 
    circleColor: "#E0E0E0", 
    waveHeight: 0.03, 
    waveCount: 2, 
    waveRiseTime: 2000, 
    waveAnimateTime: 4000, 
    waveRise: true,
    waveHeightScaling: false, 
    waveAnimate: true,
    waveColor: "#1976D2", 
    waveOffset: 0,
    textVertPosition: 0.5,
    textSize: 1, 
    valueCountUp: true,
    textSuffix: "%",
    textColor: "#1976D2", 
    waveTextColor: "#FFFFFF", 
    toFixed: 0,
  };
}

type Props = {
  config?: Partial<GaugeConfig>;
  width?: number;
  height?: number;
  value?: number;
};

export const LiquidGauge = ({
  config,
  width = 250,
  height = 250,
  value = 50,
}: Props) => {
  const defaultConfig = liquidFillGaugeDefaultSettings();
  const mergedConfig = { ...defaultConfig, ...config };

  const radius = Math.min(width, height) / 2;
  const circleThickness = mergedConfig.circleThickness * radius;

  const circleFillGap = mergedConfig.circleFillGap * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;

  const fillPercent =
    Math.max(mergedConfig.minValue, Math.min(mergedConfig.maxValue, value)) /
    mergedConfig.maxValue;

  let waveHeightScale;
  if (mergedConfig.waveHeightScaling) {
    waveHeightScale = scaleLinear()
      .range([0, mergedConfig.waveHeight, 0])
      .domain([0, 50, 100]);
  } else {
    waveHeightScale = scaleLinear()
      .range([mergedConfig.waveHeight, mergedConfig.waveHeight])
      .domain([0, 100]);
  }

  const waveClipCount = 1 + mergedConfig.waveCount;
  const waveLength = (fillCircleRadius * 2) / mergedConfig.waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

  const textPixels = (mergedConfig.textSize * radius) / 2;
  const textFinalValue = Number(value.toFixed(mergedConfig.toFixed));
  const textStartValue = mergedConfig.valueCountUp
    ? mergedConfig.minValue
    : textFinalValue;

  const textRiseScaleY = scaleLinear()
    .range([
      fillCircleMargin + fillCircleRadius * 2,
      fillCircleMargin + textPixels * 0.7,
    ])
    .domain([0, 1]);

  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const clipArea = area()
    .x((d) => waveScaleX(d[0]))
    .y0((d) =>
      waveScaleY(
        Math.sin(
          Math.PI * 2 * mergedConfig.waveOffset * -1 +
            Math.PI * 2 * (1 - mergedConfig.waveCount) +
            d[1] * 2 * Math.PI
        )
      )
    )
    .y1(() => fillCircleRadius * 2 + waveHeight * 5);

  const waveGroupXPosition =
    fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;

  const font = useFont(require("../../assets/fonts/Roboto-Bold.ttf"), textPixels);

  const textValue = useSharedValue(textStartValue);
  const translateYPercent = useSharedValue(0);
  const translateXProgress = useSharedValue(0);

  // Progresso da borda (animado)
  const progressValue = useSharedValue(fillPercent);

  useEffect(() => {
    translateYPercent.value = withTiming(fillPercent, {
      duration: mergedConfig.waveRiseTime,
    });
    progressValue.value = withTiming(fillPercent, {
      duration: mergedConfig.waveRiseTime,
    });
  }, [fillPercent]);

  useEffect(() => {
    textValue.value = withTiming(textFinalValue, {
      duration: mergedConfig.valueCountUp ? mergedConfig.waveRiseTime : 0,
    });
  }, [textFinalValue]);

  useEffect(() => {
    if (mergedConfig.waveAnimate) {
      translateXProgress.value = withRepeat(
        withTiming(1, {
          duration: mergedConfig.waveAnimateTime,
          easing: Easing.linear,
        }),
        -1
      );
    }
  }, [mergedConfig.waveAnimate]);

  const text = useDerivedValue(() => {
    return `${textValue.value.toFixed(mergedConfig.toFixed)}${
      mergedConfig.textSuffix
    }`;
  }, [textValue]);

  const textTranslateX = useDerivedValue(() => {
    const textWidth = font?.getTextWidth(text.value) ?? 0;
    return radius - textWidth * 0.5;
  }, [text, radius, font]);

  const clipSVGString = clipArea(data)!;
  const path = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(clipSVGString)!;
    const m = Skia.Matrix();
    m.translate(
      waveGroupXPosition + waveLength * translateXProgress.value,
      fillCircleMargin + (1 - translateYPercent.value) * fillCircleRadius * 2
    );
    p.transform(m);
    return p;
  }, [translateXProgress, translateYPercent, clipSVGString]);

  const textTransform = [
    { translateY: textRiseScaleY(mergedConfig.textVertPosition) - textPixels },
  ];

  // path animado da borda
  const borderPath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const sweepAngle = 360 * progressValue.value;
    p.addArc(
      {
        x: circleThickness * 0.5,
        y: circleThickness * 0.5,
        width: (radius - circleThickness * 0.5) * 2,
        height: (radius - circleThickness * 0.5) * 2,
      },
      -90,
      sweepAngle
    );
    return p;
  }, [progressValue]);

  return (
    <View>
      <Canvas style={{ width, height }}>
        <Group>
         
          <Circle
            cx={radius}
            cy={radius}
            r={radius - circleThickness * 0.5}
            color="#e0e0e0"
            style="stroke"
            strokeWidth={circleThickness}
          />

         
          <Path
            path={borderPath}
            style="stroke"
            strokeWidth={circleThickness}
            color="#178BCA"
            strokeCap="round"
          />

          
          <Text
            x={textTranslateX}
            y={textPixels}
            text={text}
            font={font}
            color={mergedConfig.textColor}
            transform={textTransform}
          />

         
          <Group clip={path}>
            <Circle
              cx={radius}
              cy={radius}
              r={fillCircleRadius}
              color={mergedConfig.waveColor}
            />
            <Text
              x={textTranslateX}
              y={textPixels}
              text={text}
              font={font}
              color={mergedConfig.waveTextColor}
              transform={textTransform}
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
};
