import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

const AVATAR_SIZE = 120;

const AvatarComponent: React.FC = React.memo(() => (
  <View style={styles.container}>
    <Avatar.Image
      size={AVATAR_SIZE}
      source={require("../../assets/avatar.jpeg")}
    />
    <TouchableOpacity style={styles.iconWrapper}>
      <Entypo name="camera" size={18} color="#084F8C" />
    </TouchableOpacity>
  </View>
));

const styles = StyleSheet.create({
  container: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginRight: 15,
  },

  iconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default AvatarComponent;
