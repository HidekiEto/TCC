import * as React from "react";
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Text, 
  Pressable, 
  Dimensions, 
  FlatList,
  Image,
  ActivityIndicator 
} from "react-native";
import { Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { firestore, auth } from "../../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

const AVATAR_SIZE = Math.round(width * 0.30);

// Array com todos os avatares disponíveis (pulando o Avatar02 que não existe)
const AVATARS = [
  { id: 1, source: require('../../assets/avatars/Avatar01.png') },
  { id: 3, source: require('../../assets/avatars/Avatar03.png') },
  { id: 4, source: require('../../assets/avatars/Avatar04.png') },
  { id: 5, source: require('../../assets/avatars/Avatar05.png') },
  { id: 6, source: require('../../assets/avatars/Avatar06.png') },
  { id: 7, source: require('../../assets/avatars/Avatar07.png') },
  { id: 8, source: require('../../assets/avatars/Avatar08.png') },
  { id: 9, source: require('../../assets/avatars/Avatar09.png') },
  { id: 10, source: require('../../assets/avatars/Avatar10.png') },
  { id: 11, source: require('../../assets/avatars/Avatar11.png') },
  { id: 12, source: require('../../assets/avatars/Avatar12.png') },
  { id: 13, source: require('../../assets/avatars/Avatar13.png') },
  { id: 14, source: require('../../assets/avatars/Avatar14.png') },
  { id: 15, source: require('../../assets/avatars/Avatar15.png') },
  { id: 16, source: require('../../assets/avatars/Avatar16.png') },
  { id: 17, source: require('../../assets/avatars/Avatar17.png') },
  { id: 18, source: require('../../assets/avatars/Avatar18.png') },
  { id: 19, source: require('../../assets/avatars/Avatar19.png') },
  { id: 20, source: require('../../assets/avatars/Avatar20.png') },
  { id: 21, source: require('../../assets/avatars/Avatar21.png') },
];

interface AvatarComponentProps {
  onImageSelect?: (avatarId: number) => void;
  triggerImagePicker?: boolean;
  onTriggerReset?: () => void;
}

const AvatarComponent: React.FC<AvatarComponentProps> = React.memo(({ 
  onImageSelect, 
  triggerImagePicker, 
  onTriggerReset 
}) => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar avatar salvo do usuário
  useEffect(() => {
    const fetchAvatar = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.avatarId) {
              setSelectedAvatarId(data.avatarId);
            } else {
              setSelectedAvatarId(1); // Avatar padrão se não tiver salvo
            }
          } else {
            setSelectedAvatarId(1); // Avatar padrão para novos usuários
          }
        } catch (error) {
          console.error("Erro ao carregar avatar:", error);
          setSelectedAvatarId(1); // Avatar padrão em caso de erro
        } finally {
          setLoading(false);
        }
      } else {
        setSelectedAvatarId(1);
        setLoading(false);
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

  // Salvar avatar selecionado no Firestore
  const handleAvatarSelect = async (avatarId: number) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      
      // Salvar no Firestore
      await setDoc(
        doc(firestore, "users", user.uid), 
        { avatarId }, 
        { merge: true }
      );
      
      setSelectedAvatarId(avatarId);
      onImageSelect?.(avatarId);
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarPress = () => {
    setModalVisible(true);
  };

  const getAvatarSource = () => {
    if (selectedAvatarId === null) {
      return AVATARS[0].source; // Retorna avatar padrão enquanto carrega
    }
    const avatar = AVATARS.find(a => a.id === selectedAvatarId);
    return avatar ? avatar.source : AVATARS[0].source;
  };

  const renderAvatarItem = ({ item }: { item: typeof AVATARS[0] }) => {
    const isSelected = item.id === selectedAvatarId;
    return (
      <TouchableOpacity
        style={[
          styles.avatarItem,
          isSelected && styles.avatarItemSelected
        ]}
        onPress={() => handleAvatarSelect(item.id)}
      >
        <View style={styles.avatarImageContainer}>
          <Image 
            source={item.source} 
            style={styles.avatarItemImage}
          />
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <MaterialIcons name="check-circle" size={24} color="#27D5E8" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {selectedAvatarId !== null ? (
        <Avatar.Image
          size={AVATAR_SIZE}
          source={getAvatarSource()}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#27D5E8" />
        </View>
      )}
      {loading && selectedAvatarId !== null && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#27D5E8" />
        </View>
      )}
      <TouchableOpacity style={styles.iconWrapper} onPress={handleAvatarPress}>
        <MaterialIcons name="swap-horiz" size={20} color="#084F8C" />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha seu Avatar</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={AVATARS}
              renderItem={renderAvatarItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.avatarGrid}
              showsVerticalScrollIndicator={false}
            />
            
            <Pressable 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(false)}
            >
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
    borderWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: AVATAR_SIZE / 2,
  },
  iconWrapper: {
    position: "absolute",
    bottom: -width * 0.005,
    right: -width * 0.005,
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  avatarGrid: {
    paddingVertical: 10,
  },
  avatarItem: {
    flex: 1,
    margin: width * 0.015,
    aspectRatio: 1,
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  avatarItemSelected: {
    borderColor: '#27D5E8',
    elevation: 5,
    shadowColor: '#27D5E8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  selectedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 2,
  },
  cancelButton: {
    paddingVertical: height * 0.018,
    marginTop: height * 0.015,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: width * 0.03,
  },
  cancelText: {
    fontSize: Math.round(width * 0.04),
    color: '#666',
    fontWeight: '600',
  },
});

export default AvatarComponent;
