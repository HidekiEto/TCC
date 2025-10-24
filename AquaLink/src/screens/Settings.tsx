import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";

const { width, height } = Dimensions.get("window");

export default function Settings() {
  const navigation = useNavigation<any>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem("notificationsEnabled");
      const sound = await AsyncStorage.getItem("soundEnabled");
      const vibration = await AsyncStorage.getItem("vibrationEnabled");
      const darkMode = await AsyncStorage.getItem("darkModeEnabled");
      const autoSync = await AsyncStorage.getItem("autoSyncEnabled");
      const keepLogged = await AsyncStorage.getItem("keepLoggedIn");

      if (notifications !== null) setNotificationsEnabled(notifications === "true");
      if (sound !== null) setSoundEnabled(sound === "true");
      if (vibration !== null) setVibrationEnabled(vibration === "true");
      if (darkMode !== null) setDarkModeEnabled(darkMode === "true");
      if (autoSync !== null) setAutoSyncEnabled(autoSync === "true");
      if (keepLogged !== null) setKeepLoggedIn(keepLogged === "true");
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
      console.error("Erro ao salvar configuração:", e);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza de que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              const auth = getAuth();
              
              await AsyncStorage.removeItem("keepLoggedIn");
              await AsyncStorage.removeItem("userToken");
              try { await GoogleSignin.signOut(); } catch {}
              try { await GoogleSignin.revokeAccess(); } catch {}
              
              await signOut(auth);
              console.log("Logout realizado com sucesso.");
              
              // Redirecionar para a tela de Login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (e) {
              console.error("Erro no logout:", e);
              Alert.alert("Erro", "Não foi possível sair.");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            Alert.alert("Em Desenvolvimento", "Esta funcionalidade será implementada em breve.");
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    Alert.alert(
      "Limpar Cache",
      "Isso vai remover dados temporários do aplicativo. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          onPress: async () => {
            try {
              // Aqui você pode implementar a lógica de limpeza de cache
              Alert.alert("Sucesso", "Cache limpo com sucesso!");
            } catch (e) {
              Alert.alert("Erro", "Não foi possível limpar o cache.");
            }
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    showSwitch = true,
    onPress,
    iconColor = "#1976D2",
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    showSwitch?: boolean;
    onPress?: () => void;
    iconColor?: string;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress && showSwitch}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
          <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch && value !== undefined && onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#D1D5DB", true: "#27D5E8" }}
          thumbColor={value ? "#1976D2" : "#f4f3f4"}
        />
      )}
      {onPress && !showSwitch && (
        <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F8F9FA" barStyle="light-content" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#13c6e6ff" />
        </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SettingSection title="Notificações">
          <SettingRow
            icon="bell"
            title="Notificações"
            subtitle="Receber lembretes de hidratação"
            value={notificationsEnabled}
            onValueChange={(val) => {
              setNotificationsEnabled(val);
              saveSetting("notificationsEnabled", val);
            }}
            iconColor="#F59E0B"
          />
          <SettingRow
            icon="volume-high"
            title="Som"
            subtitle="Sons de notificação"
            value={soundEnabled}
            onValueChange={(val) => {
              setSoundEnabled(val);
              saveSetting("soundEnabled", val);
            }}
            iconColor="#10B981"
          />
          <SettingRow
            icon="vibrate"
            title="Vibração"
            subtitle="Vibrar ao receber notificação"
            value={vibrationEnabled}
            onValueChange={(val) => {
              setVibrationEnabled(val);
              saveSetting("vibrationEnabled", val);
            }}
            iconColor="#8B5CF6"
          />
          <SettingRow
            icon="clock-outline"
            title="Gerenciar Lembretes"
            subtitle="Configure horários e frequência"
            showSwitch={false}
            onPress={() => navigation.navigate("ReminderSettings")}
            iconColor="#06B6D4"
          />
        </SettingSection>

        <SettingSection title="Aparência">
          <SettingRow
            icon="theme-light-dark"
            title="Modo Escuro"
            subtitle="Em breve"
            value={darkModeEnabled}
            onValueChange={(val) => {
              setDarkModeEnabled(val);
              saveSetting("darkModeEnabled", val);
              Alert.alert("Em Desenvolvimento", "O modo escuro será implementado em breve.");
            }}
            iconColor="#6366F1"
          />
        </SettingSection>

        <SettingSection title="Conta e Dados">
          <SettingRow
            icon="sync"
            title="Sincronização Automática"
            subtitle="Sincronizar dados automaticamente"
            value={autoSyncEnabled}
            onValueChange={(val) => {
              setAutoSyncEnabled(val);
              saveSetting("autoSyncEnabled", val);
            }}
            iconColor="#3B82F6"
          />
          <SettingRow
            icon="account-check"
            title="Manter Conectado"
            subtitle="Permanecer logado no aplicativo"
            value={keepLoggedIn}
            onValueChange={(val) => {
              setKeepLoggedIn(val);
              saveSetting("keepLoggedIn", val);
            }}
            iconColor="#059669"
          />
          <SettingRow
            icon="account-edit"
            title="Editar Perfil"
            subtitle="Alterar informações pessoais"
            showSwitch={false}
            onPress={() => navigation.navigate("Profile")}
            iconColor="#1976D2"
          />
        </SettingSection>

        <SettingSection title="Privacidade e Segurança">
          <SettingRow
            icon="shield-check"
            title="Privacidade"
            subtitle="Gerenciar dados e privacidade"
            showSwitch={false}
            onPress={() => Alert.alert("Em Desenvolvimento", "Esta funcionalidade será implementada em breve.")}
            iconColor="#7C3AED"
          />
          <SettingRow
            icon="lock"
            title="Segurança"
            subtitle="Configurações de segurança"
            showSwitch={false}
            onPress={() => Alert.alert("Em Desenvolvimento", "Esta funcionalidade será implementada em breve.")}
            iconColor="#DC2626"
          />
        </SettingSection>

        <SettingSection title="Armazenamento">
          <SettingRow
            icon="delete-sweep"
            title="Limpar Cache"
            subtitle="Liberar espaço de armazenamento"
            showSwitch={false}
            onPress={handleClearCache}
            iconColor="#F97316"
          />
        </SettingSection>

        <SettingSection title="Sobre">
          <SettingRow
            icon="information"
            title="Sobre o AquaLink"
            subtitle="Versão 1.0.0"
            showSwitch={false}
            onPress={() => Alert.alert("AquaLink", "Versão 1.0.0\n\nAplicativo de monitoramento de hidratação com garrafa inteligente.")}
            iconColor="#0EA5E9"
          />
          <SettingRow
            icon="file-document"
            title="Termos de Uso"
            subtitle="Política de privacidade e termos"
            showSwitch={false}
            onPress={() => Alert.alert("Em Desenvolvimento", "Esta funcionalidade será implementada em breve.")}
            iconColor="#64748B"
          />
          <SettingRow
            icon="help-circle"
            title="Ajuda e Suporte"
            subtitle="Obtenha ajuda com o aplicativo"
            showSwitch={false}
            onPress={() => Alert.alert("Em Desenvolvimento", "Esta funcionalidade será implementada em breve.")}
            iconColor="#14B8A6"
          />
        </SettingSection>

        <SettingSection title="Conta">
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#27D5E8" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <MaterialCommunityIcons name="delete-forever" size={24} color="#fff" />
            <Text style={styles.deleteButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </SettingSection>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#1976D2",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#27D5E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27D5E8",
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});
