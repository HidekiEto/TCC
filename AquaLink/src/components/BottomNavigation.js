import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomMenu() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeKey, setActiveKey] = React.useState(route.name.toLowerCase());

  const items = [
    { key: 'calendar', iconName: 'calendar-outline', iconActiveName: 'calendar', type: 'ion', label: 'Calendário' },
    { key: 'aqualink', iconName: 'water-outline', iconActiveName: 'water', type: 'ion', label: 'Aqualink' },
    { key: 'home', iconName: 'home-outline', iconActiveName: 'home', type: 'ion', label: 'Home' },
    { key: 'perfil', iconName: 'user-o', iconActiveName: 'user', type: 'fa', label: 'Perfil' },
    { key: 'conquistas', iconName: 'trophy', iconActiveName: 'trophy', type: 'fa', label: 'Conquistas' },
  ];

  const handlePress = (key) => {
    setActiveKey(key);
    navigation.navigate(key.charAt(0).toUpperCase() + key.slice(1));
  };

  const renderIcon = (item, isActive) => {
    const size = isActive ? 28 : 24;
    const color = isActive ? '#082862' : 'white';

    if (item.type === 'ion') {
      return <Ionicons name={isActive ? item.iconActiveName : item.iconName} size={size} color={color} />;
    } else {
      return <FontAwesome name={isActive ? item.iconActiveName : item.iconName} size={size} color={color} />;
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
            style={[
              styles.item,
              isActive && styles.activeItem, 
            ]}
          >
            {renderIcon(item, isActive)}
            {!isActive && <Text style={styles.label}>{item.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#084F8C',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
  activeItem: {
    transform: [{ translateY: -20 }], 
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
});
