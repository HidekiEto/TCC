import { Text, View, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform } from "react-native";
import BottomMenu from "../components/BottomNavigation";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const { width, height } = Dimensions.get('window');

export default function Achievements() {
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldPlaySound: true,
                shouldSetBadge: false,
                shouldShowBanner: true,
                shouldShowList: true,
            } as Notifications.NotificationBehavior),
        });
        (async () => {
            if (Platform.OS === 'android') {
                try {
                    await Notifications.setNotificationChannelAsync('default', {
                        name: 'Notificações AquaLink',
                        importance: Notifications.AndroidImportance.HIGH,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#082862',
                        sound: 'default',
                    });
                } catch (e) {
                    console.warn('Falha ao criar canal de notificação:', e);
                }
            }
        })();
    }, []);

    const requestPermission = async () => {
        try {
            const settings = await Notifications.getPermissionsAsync();
            let status = settings.status;
            if (status !== 'granted') {
                const r = await Notifications.requestPermissionsAsync();
                status = r.status;
            }
            Alert.alert('Permissão', `Status: ${status}`);
        } catch (e: any) {
            Alert.alert('Permissão', e?.message ?? 'Falha ao solicitar permissão');
        }
    };

    const scheduleIn5s = async () => {
        try {
            let status = (await Notifications.getPermissionsAsync()).status;
            if (status !== 'granted') {
                status = (await Notifications.requestPermissionsAsync()).status;
            }
            if (status !== 'granted') {
                Alert.alert('Permissão', 'Permissão de notificação negada.');
                return;
            }
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Teste de Notificação',
                    body: 'Esta notificação foi agendada para 5 segundos.',
                    sound: 'default',
                },
                trigger: { type: 'timeInterval', seconds: 5, repeats: false } as Notifications.TimeIntervalTriggerInput,
            });
            Alert.alert('Agendado', `ID: ${id}`);
        } catch (e: any) {
            Alert.alert('Agendar', e?.message ?? 'Falha ao agendar');
        }
    };

    const listScheduled = async () => {
        try {
            const list = await Notifications.getAllScheduledNotificationsAsync();
            console.log('Agendadas:', list);
            Alert.alert('Agendadas', `Total: ${list.length}`);
        } catch (e: any) {
            Alert.alert('Listar', e?.message ?? 'Falha ao listar');
        }
    };

    const cancelAll = async () => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            Alert.alert('Cancelar', 'Todas as notificações agendadas foram canceladas.');
        } catch (e: any) {
            Alert.alert('Cancelar', e?.message ?? 'Falha ao cancelar');
        }
    };

    const handleLogout = async () => {
        try {
            const auth = getAuth();
            
            await AsyncStorage.removeItem('keepLoggedIn');
            await AsyncStorage.removeItem('userToken');
            try { await GoogleSignin.signOut(); } catch {}
            try { await GoogleSignin.revokeAccess(); } catch {}
            
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
            <View style={styles.card}>
                <Text style={styles.title}>Teste de Notificações</Text>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#1976D2' }]} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Pedir Permissão</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#2E7D32' }]} onPress={scheduleIn5s}>
                    <Text style={styles.buttonText}>Agendar em 5s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#455A64' }]} onPress={listScheduled}>
                    <Text style={styles.buttonText}>Listar Agendadas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#E64A19' }]} onPress={cancelAll}>
                    <Text style={styles.buttonText}>Cancelar Todas</Text>
                </TouchableOpacity>
                {!Device.isDevice && (
                    <Text style={styles.note}>Dica: em emuladores as notificações podem se comportar diferente. Prefira dispositivo físico.</Text>
                )}
            </View>
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
    card: {
        width: '90%',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#082862',
        marginBottom: 12,
        textAlign: 'center',
    },
    button: {
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    note: {
        marginTop: 8,
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
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