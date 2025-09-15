import React, { useMemo } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome, Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../types/navigation";

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
  iconName: string;
  iconActiveName: string;
}

type Key = "calendar" | "dashboard" | "home" | "profile" | "achievements";

const ROUTE_MAP: Record<Key, string> = {
  calendar: "Calendar",
  dashboard: "Dashboard",
  home: "Home",
  profile: "Profile",
  achievements: "Achievements",
};

const items: MenuItem[] = [
  { key: "calendar", iconName: "calendar-outline", iconActiveName: "calendar", type: "ion", label: "Calendário" },
  { key: "dashboard", iconName: "water-outline", iconActiveName: "water", type: "mci", label: "Dashboard" },
  { key: "home", iconName: "home-outline", iconActiveName: "home", type: "ion", label: "Home" },
  { key: "profile", iconName: "user-o", iconActiveName: "user", type: "fa", label: "Perfil" },
  { key: "achievements", iconName: "trophy-outline", iconActiveName: "trophy", type: "ion", label: "Conquistas" },
];

const BottomMenu: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  
 
  const reverseRouteMap = useMemo(() => {
    return Object.entries(ROUTE_MAP).reduce<Record<string, Key>>((acc, [k, v]) => {
      acc[v as string] = k as Key;
      return acc;
    }, {});
  }, []);
  
  // Calcular activeKey diretamente baseado na rota atual
  const activeKey = useMemo(() => {
    const currentRouteName = route.name ?? "Home";
    const key = reverseRouteMap[currentRouteName] || "home";
    return key;
  }, [route.name, reverseRouteMap]);

  
  const handlePress = (key: Key) => {
    const routeName = ROUTE_MAP[key];
    if (routeName) {
      navigation.navigate(routeName as never);
    }
  };

  const renderIcon = (item: MenuItem, isActive: boolean) => {
    const size = isActive ? 28 : 24;
    const color = isActive ? "#082862" : "white";

    switch (item.type) {
      case "ion":
        return (
          <Ionicons
            name={(isActive ? item.iconActiveName : item.iconName) as IonIconNames}
            size={size}
            color={color}
          />
        );
      case "fa":
        return (
          <FontAwesome
            name={(isActive ? item.iconActiveName : item.iconName) as FaIconNames}
            size={size}
            color={color}
          />
        );
      case "oct":
        return (
          <Octicons
            name={(isActive ? item.iconActiveName : item.iconName) as OctIconNames}
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
            onPress={() => handlePress(item.key as Key)}
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

export default React.memo(BottomMenu);

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

