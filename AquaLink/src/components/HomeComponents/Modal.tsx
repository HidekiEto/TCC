import React, { useState } from "react";
import { Modal, Portal, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, ViewStyle, StyleProp, StyleSheet } from "react-native";

interface ModalComponentProps {
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  info1?: string;
  info2?: string;
  info3?: string;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  icon,
  info1,
  info2,
  info3,
  containerStyle,
  buttonStyle,
  children,
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
          contentContainerStyle={[styles.modalContainer, containerStyle]}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name={icon} size={32} color="#084F8C" />
              <Text style={styles.modalTitle}>{title}</Text>
            </View>
            
            {info1 && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="circle" size={8} color="#084F8C" />
                <Text style={styles.infoText}>{info1}</Text>
              </View>
            )}
            {info2 && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="circle" size={8} color="#084F8C" />
                <Text style={styles.infoText}>{info2}</Text>
              </View>
            )}
            {info3 && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="circle" size={8} color="#084F8C" />
                <Text style={styles.infoText}>{info3}</Text>
              </View>
            )}
            
            {children}
            
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      <TouchableOpacity style={[styles.triggerButton, buttonStyle]} onPress={showModal} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#084F8C',
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#084F8C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  triggerButton: {
  
  },
});

export default ModalComponent;
