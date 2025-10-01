import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const Title: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.aquaText}>
        Aqua
      </Text>
      <Text style={styles.linkText}>
        Link
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aquaText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    lineHeight: 60,
  },
  linkText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'normal',
    lineHeight: 60,
  },
});

export default Title;
