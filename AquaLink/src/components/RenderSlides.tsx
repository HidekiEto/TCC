import { View, Text, Image, ImageSourcePropType, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');

interface SlideItem {
  key?: string;
  component: React.ReactNode;
  text?: string;
  image?: ImageSourcePropType;
}

interface RenderSlidesProps {
  item: SlideItem;
}

export default function RenderSlides({ item }: RenderSlidesProps) {
  const isKey1 = item.key === "1"; // verifica se a key é 1

  return (
    <LinearGradient
      colors={["#084F8C", "#27D5E8"]}
      style={[StyleSheet.absoluteFillObject, { width, height }]}
    >
      <View style={[
        styles.container,
        isKey1 ? styles.centerContent : styles.topContent
      ]}>
        {item.component}

        {item.text && (
          <Text style={styles.text}>
            {item.text}
          </Text>
        )}

        {item.image && (
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centerContent: {
    justifyContent: 'center',
  },
  topContent: {
    justifyContent: 'flex-start',
    marginTop: 64,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 32,
    marginTop: 20,
    fontWeight: '400',
    lineHeight: 40,
  },
  imageContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
