import React, { Suspense } from "react";
import { Text, View, TouchableOpacity, ScrollView, Dimensions, StatusBar, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigation from "../components/BottomNavigation";
import AvatarComponent from "../components/ProfileComponents/Avatar";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// carregamento dinâmico robusto para módulos com export default ou export nomeado
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
          {/* Header Section with Avatar and User Info */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <AvatarComponent />
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  Henry & BiBi
                </Text>
                <Text style={styles.userEmail}>
                  henryebibi@gmail.com
                </Text>

                <TouchableOpacity style={styles.editButton}>
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

          {/* Performance Overview Section */}
          <View style={styles.performanceSection}>
            <Text style={styles.performanceTitle}>
              Visão Geral da performance
            </Text>
            <Text style={styles.performanceSubtitle}>
              Média p/dia: <Text style={styles.performanceValue}>2240 mls</Text>
            </Text>
          </View>

          {/* Chart Section */}
          <View style={styles.chartSection}>
            <Suspense
              fallback={
                <View style={styles.fallback}>
                  <ActivityIndicator size="large" color="#27D5E8" />
                </View>
              }
            >
              <Graphic />
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
    paddingBottom: 100,
  },
  headerSection: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'white',
    marginBottom: 15,
    fontWeight: '400',
  },
  editButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    marginRight: 6,
  },
  editButtonText: {
    color: '#084F8C',
    fontSize: 14,
    fontWeight: '600',
  },
  performanceSection: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 0,
  },
  performanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  performanceSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  performanceValue: {
    fontWeight: 'bold',
    color: '#084F8C',
  },
  chartSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  fallback: {
    height: 240,
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
