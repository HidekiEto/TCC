import React, { useState } from "react";
import { Modal, Portal, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

interface ModalComponentProps {
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; // ✅ aqui
  info1?: string;
  info2?: string;
  containerStyle?: StyleProp<ViewStyle>;
  buttonClassName?: string; 
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  icon,
  info1,
  info2,
  containerStyle,
  buttonClassName,
}) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={
            containerStyle || { backgroundColor: "white", padding: 20, borderRadius: 16 }
          }
        >
          <View className="bg-white p-6 rounded-2xl">
            <Text className="text-lg font-bold mb-2">{title}</Text>
            {info1 && (
              <Text className="flex-row items-center">
                <MaterialCommunityIcons name={icon} size={16} color="black" /> {info1}
              </Text>
            )}
            {info2 && (
              <Text className="flex-row items-center">
                <MaterialCommunityIcons name={icon} size={16} color="black" /> {info2}
              </Text>
            )}
          </View>
        </Modal>
      </Portal>

      <TouchableOpacity className={buttonClassName} onPress={showModal} activeOpacity={0.8}>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name={icon} size={32} color="black" />
          <Text className="ml-3">{title}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ModalComponent;
