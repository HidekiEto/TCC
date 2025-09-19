import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import BottomMenu from "../components/BottomNavigation";
import { getAuth, signOut } from "firebase/auth";

export default function Achievements() {
    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            Alert.alert("Logout", "Você saiu do aplicativo.");
        } catch (e) {
            Alert.alert("Erro", "Não foi possível sair.");
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Conquistas</Text>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 40,
        color: '#084F8C',
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