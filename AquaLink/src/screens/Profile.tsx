import React, { Suspense, useEffect, useState } from "react";
import { calcularMetaDiariaAgua } from '../components/Goals/DailyIntake';
import { useConsumoUltimasSemanas } from '../components/Goals/WeeklyIntake';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, StatusBar, ActivityIndicator, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigation from "../components/BottomNavigation";
import AvatarComponent from "../components/ProfileComponents/Avatar";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");


const Graphic = React.lazy(() =>
  import("../components/ProfileComponents/Graphic").then((mod) => {
    const comp =
      (mod as any).default ??
      (mod as any).Graphic ??
      (mod as any).graphic ??
      (mod as any);
    return { default: comp as React.ComponentType<any> };
  })
);

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [triggerImagePicker, setTriggerImagePicker] = useState(false);
  const navigation = useNavigation<any>();
  const [uid, setUid] = useState<string | undefined>(undefined);
  const consumoSemana = useConsumoUltimasSemanas(uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUid(currentUser.uid);
    
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { firestore } = await import('../config/firebase');
          const docRef = doc(firestore, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          let data = docSnap.exists() ? docSnap.data() : {};
          setProfileData({
            peso: Number(data.weight) || 70,
            altura: Number(data.height) || 170,
            genero: (data.gender || 'masculino').toLowerCase(),
            idade: data.birthdate ? (new Date().getFullYear() - new Date(data.birthdate).getFullYear()) : 30,
          });
        } catch (e) {
          setProfileData(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
    
      setUid(user?.uid);
    }, [user])
  );

  
  const handleImageSelect = (imageUri: string) => {
    console.log('Nova imagem selecionada:', imageUri);
  
 
  };

 
  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

 
  const getUserName = () => {
    if (user?.displayName) {
      const nameParts = user.displayName.trim().split(' ');
      
      if (nameParts.length === 1) {
       
        return nameParts[0];
      } else if (nameParts.length >= 2) {
       
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        return `${firstName} ${lastName}`;
      }
    }
    
    if (user?.email) {
      
      const emailName = user.email.split('@')[0];
      const emailParts = emailName.split('.');
      
      if (emailParts.length === 1) {
       
        return emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1).toLowerCase();
      } else if (emailParts.length >= 2) {
     
        const firstName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1).toLowerCase();
        const lastName = emailParts[emailParts.length - 1].charAt(0).toUpperCase() + emailParts[emailParts.length - 1].slice(1).toLowerCase();
        return `${firstName} ${lastName}`;
      }
    }
    
    return "Usuário";
  };

  return (
    <LinearGradient
      colors={["#1081C7", "#27D5E8", "#FFFFFF"]}
      locations={[0.2, 0.9, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.20 }}
      style={styles.container}
    >
    <StatusBar backgroundColor="#1081C7" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
        
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <AvatarComponent 
                onImageSelect={handleImageSelect}
                triggerImagePicker={triggerImagePicker}
                onTriggerReset={() => setTriggerImagePicker(false)}
              />
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {getUserName()}
                </Text>
                <Text style={styles.userEmail}>
                  {user?.email || "henryebibi@gmail.com"}
                </Text>

                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEditProfile}
                >
                  <MaterialCommunityIcons
                    name="account-edit"
                    size={18}
                    color="#084F8C"
                    style={styles.editIcon}
                  />
                  <Text style={styles.editButtonText}>
                    Editar perfil
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

  
          <View style={styles.performanceSection}>
            <Text style={styles.performanceTitle}>
              Visão Geral da performance
            </Text>
            <Text style={styles.performanceSubtitle}>
              Média p/dia: <Text style={styles.performanceValue}>
                {(() => {
                  // Consumo dos últimos 7 dias
                  if (Array.isArray(consumoSemana) && consumoSemana.length > 0) {
                    
                    const lastWeek = consumoSemana[consumoSemana.length - 1];
                  
                    if (Array.isArray(lastWeek)) {
                      const soma = lastWeek.reduce((acc, v) => acc + v, 0);
                      return `${Math.round(soma / 7)} mls`;
                    } else {
                     
                      return `${Math.round(lastWeek / 7)} mls`;
                    }
                  }
                  return '--';
                })()}
              </Text>
            </Text>
          </View>

       
          <View style={styles.chartSection}>
            <Suspense
              fallback={
                <View style={styles.fallback}>
                  <ActivityIndicator size="large" color="#27D5E8" />
                </View>
              }
            >
              <Graphic
                data={consumoSemana}
                metaDiaria={profileData ? calcularMetaDiariaAgua(profileData) : 0}
              />
            </Suspense>
          </View>
        </ScrollView>

        <View style={styles.bottomNavigation}>
          <BottomNavigation />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: height * 0.12,
  },
  headerSection: {
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: width * 0.9,
  },
  userInfo: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  userName: {
    fontSize: Math.round(width * 0.06),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.005,
  },
  userEmail: {
    fontSize: Math.round(width * 0.035),
    color: 'white',
    marginBottom: height * 0.018,
    fontWeight: '400',
  },
  editButton: {
    backgroundColor: 'white',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editIcon: {
    marginRight: width * 0.015,
  },
  editButtonText: {
    color: '#084F8C',
    fontSize: Math.round(width * 0.035),
    fontWeight: '600',
  },
  performanceSection: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.09,
    paddingBottom: 0,
  },
  performanceTitle: {
    fontSize: Math.round(width * 0.05),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },
  performanceSubtitle: {
    fontSize: Math.round(width * 0.035),
    color: '#666',
  },
  performanceValue: {
    fontWeight: 'bold',
    color: '#084F8C',
  },
  chartSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingTop: 0,
  },
  fallback: {
    height: height * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
