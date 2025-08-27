import * as React from 'react';
import { Modal, Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

const ModalComponent = ({ title, icon, info1, info2, containerStyle, buttonStyle }) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={hideModal} 
          contentContainerStyle={containerStyle || { backgroundColor: 'white', padding: 20, borderRadius: 16 }}
        >
          <View className="bg-white p-6 rounded-2xl ">
            <Text className="text-lg font-bold mb-2">{title}</Text>
            <Text><MaterialCommunityIcons name={icon} size={12} color="black" /> {info1}</Text>
            <Text><MaterialCommunityIcons name={icon} size={12} color="black" /> {info2}</Text>
          </View>
        </Modal>
      </Portal>

      <TouchableOpacity
        className={buttonStyle}
        onPress={showModal}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          <MaterialCommunityIcons name={icon} size={32} color="black" />
          <Text className="ml-3">{title}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ModalComponent;
