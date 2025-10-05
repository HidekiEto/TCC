import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Modal, Text, Pressable, Dimensions } from "react-native";
import { Avatar } from "react-native-paper";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import { storage, firestore, auth } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

const AVATAR_SIZE = Math.round(width * 0.28);

interface AvatarComponentProps {
  onImageSelect?: (imageUri: string) => void;
  triggerImagePicker?: boolean;
  onTriggerReset?: () => void;
}

const AvatarComponent: React.FC<AvatarComponentProps> = React.memo(({ 
  onImageSelect, 
  triggerImagePicker, 
  onTriggerReset 
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchAvatar = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.avatarUrl) {
            setImageUri(data.avatarUrl);
          }
        }
      }
    };
    fetchAvatar();
  }, []);

  useEffect(() => {
    if (triggerImagePicker) {
      setModalVisible(true);
      onTriggerReset?.();
    }
  }, [triggerImagePicker, onTriggerReset]);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permissões necessárias',
        'Precisamos de permissão para acessar a câmera e galeria.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };


  const uploadImageAsync = async (uri: string) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
     
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
  await setDoc(doc(firestore, "users", user.uid), { avatarUrl: downloadURL }, { merge: true });
      setImageUri(downloadURL);
      onImageSelect?.(downloadURL);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível salvar a imagem.');
    }
    setLoading(false);
  };

  const openCamera = async () => {
    setModalVisible(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const newImageUri = result.assets[0].uri;
        await uploadImageAsync(newImageUri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  const openGallery = async () => {
    setModalVisible(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const newImageUri = result.assets[0].uri;
        await uploadImageAsync(newImageUri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const handleAvatarPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={AVATAR_SIZE}
        source={imageUri ? { uri: imageUri } : require("../../assets/avatar.png")}
        style={styles.avatar}
      />
      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: AVATAR_SIZE/2 }}>
          <Text>Salvando...</Text>
        </View>
      )}
      <TouchableOpacity style={styles.iconWrapper} onPress={handleAvatarPress}>
        <Entypo name="camera" size={18} color="#084F8C" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Foto</Text>
            
            <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
              <MaterialIcons name="camera-alt" size={24} color="#084F8C" />
              <Text style={styles.optionText}>Câmera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
              <MaterialIcons name="photo-library" size={24} color="#084F8C" />
              <Text style={styles.optionText}>Galeria</Text>
            </TouchableOpacity>
            
            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
    left: -width * 0.025,
  },
  avatar: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconWrapper: {
    position: "absolute",
    bottom: -width * 0.005,
    right: -width * 0.005,
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.035,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    padding: width * 0.05,
    paddingBottom: height * 0.05,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.05,
    marginVertical: height * 0.006,
    backgroundColor: '#f8f9fa',
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optionText: {
    fontSize: Math.round(width * 0.04),
    marginLeft: width * 0.04,
    color: '#333',
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: height * 0.018,
    marginTop: height * 0.012,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: Math.round(width * 0.04),
    color: '#666',
    fontWeight: '500',
  },
});

export default AvatarComponent;
