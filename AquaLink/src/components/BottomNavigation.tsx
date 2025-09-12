import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome, Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";

// Tipos para nomes de ícones
type IonIconNames = keyof typeof Ionicons.glyphMap;
type FaIconNames = keyof typeof FontAwesome.glyphMap;
type OctIconNames = keyof typeof Octicons.glyphMap;
type MciIconNames = keyof typeof MaterialCommunityIcons.glyphMap;

// Tipagem do item do menu
interface MenuItem {
  key: string;
  type: "ion" | "fa" | "oct" | "mci";
  label: string;
  iconName: string; // nome padrão
  iconActiveName: string; // nome quando ativo
}

export const BottomMenu: React.FC = () => {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const route = useRoute();
  const [activeKey, setActiveKey] = useState(route.name.toLowerCase());

  const items: MenuItem[] = [
    { key: "calendar", iconName: "calendar-outline", iconActiveName: "calendar", type: "ion", label: "Calendário" },
    { key: "dashboard", iconName: "water", iconActiveName: "water-outline", type: "mci", label: "Info" },
    { key: "home", iconName: "home-outline", iconActiveName: "home", type: "ion", label: "Home" },
    { key: "profile", iconName: "user-o", iconActiveName: "user", type: "fa", label: "Perfil" },
    { key: "achievements", iconName: "trophy-outline", iconActiveName: "trophy", type: "ion", label: "Conquistas" },
  ];

  const handlePress = (key: string) => {
    setActiveKey(key);
    navigation.navigate(key.charAt(0).toUpperCase() + key.slice(1) as never);
  };

  const renderIcon = (item: MenuItem, isActive: boolean) => {
    const size = isActive ? 28 : 24;
    const color = isActive ? "#082862" : "white";

    switch (item.type) {
      case "ion":
        return (
          <Ionicons
            name={isActive ? (item.iconActiveName as IonIconNames) : (item.iconName as IonIconNames)}
            size={size}
            color={color}
          />
        );
      case "fa":
        return (
          <FontAwesome
            name={isActive ? (item.iconActiveName as FaIconNames) : (item.iconName as FaIconNames)}
            size={size}
            color={color}
          />
        );
      case "oct":
        return (
          <Octicons
            name={isActive ? (item.iconActiveName as OctIconNames) : (item.iconName as OctIconNames)}
            size={size}
            color={color}
          />
        );
        case "mci":
          return (
            <MaterialCommunityIcons
              name={isActive ? (item.iconActiveName as MciIconNames) : (item.iconName as MciIconNames)}
              size={size}
              color={color}
            />
          );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = activeKey === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => handlePress(item.key)}
            style={[styles.item, isActive && styles.activeItem]}
          >
            {renderIcon(item, isActive)}
            {!isActive && <Text style={styles.label}>{item.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#084F8C",
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
  activeItem: {
    transform: [{ translateY: -25 }],
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
