import { Text, View, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
import BottomMenu from "../components/BottomNavigation";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Achievements() {
    const handleLogout = async () => {
        try {
            const auth = getAuth();
            
            await AsyncStorage.removeItem('keepLoggedIn');
            await AsyncStorage.removeItem('userToken');
            
            await signOut(auth);
            console.log('Logout realizado com sucesso. Dados de sessão limpos.');
            Alert.alert("Logout", "Você saiu da sua conta.");
        } catch (e) {
            console.error(' Erro no logout:', e);
            Alert.alert("Erro", "Não foi possível sair.");
        }
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <BottomMenu />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logoutButton: {
        backgroundColor: '#E53935',
        paddingVertical: 30,
        paddingHorizontal: 60,
        borderRadius: 20,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    logoutText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});