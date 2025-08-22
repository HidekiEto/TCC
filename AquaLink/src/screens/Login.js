import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Form } from 'react-native';
import { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import Home from './Home';
import { useNavigation } from '@react-navigation/native';


export default function Login() {
    const navigation = useNavigation()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <LinearGradient
            style={styles.container}
            colors={['#1081C7', '#FFFF']}
        >
            <View style={{ marginBottom: 30 }}>
                <Text style={styles.title}>Acesse</Text>
                <Text style={styles.subtitle}>com E-mail e senha</Text>
            </View>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
                placeholder="Digite seu E-mail"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Digite sua senha"
                    secureTextEntry={!passwordVisible}
                    style={styles.inputPassword}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                >
                    <Ionicons
                        name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#777"
                    />
                </TouchableOpacity>
            </View>


            <View style={styles.rememberContainer}>
                <CheckBox
                    title="Lembrar senha"
                    checked={checked}
                    onPress={() => setChecked(!checked)}
                    checkedColor="#1081C7"
                    uncheckedColor="#1081C7"
                    containerStyle={styles.checkBox}
                    textStyle={{ fontSize: 14, color: "#333", fontWeight: "normal" }}
                />
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
                    <Text style={styles.btnTextPrimary}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnSecondary}>
                    <Text style={styles.btnTextSecondary}>Cadastrar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>Ou continue com</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.socialContainer}>
                <Image
                    source={require('../assets/Google.png')}
                    style={styles.socialIcon}
                />
                <Image
                    source={require('../assets/Facebook.png')}
                    style={styles.socialIcon}
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    label: {
        fontSize: 14,
        color: "#222",
        marginLeft: 5,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#f5f6fa",
        padding: 12,
        borderRadius: 8,
        marginTop: 5,
        fontSize: 14,
    },
    passwordContainer: {
        position: "relative",
        justifyContent: "center",
    },
    inputPassword: {
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#f5f6fa",
        padding: 12,
        borderRadius: 8,
        marginTop: 5,
        fontSize: 14,
        paddingRight: 40,
    },
    eyeIcon: {
        position: "absolute",
        right: 10,
        top: "35%",
    },
    rememberContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 25,
        marginBottom: 20,
    },
    checkBox: {
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    forgotText: {
        fontSize: 13,
        color: "#555",
        marginRight: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    btnPrimary: {
        backgroundColor: "#27D5E8",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    btnTextPrimary: {
        color: "#084F8C",
        fontSize: 15,
        fontWeight: "bold",
    },
    btnSecondary: {
        borderWidth: 1,
        borderColor: "#27D5E8",
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 8,
    },
    btnTextSecondary: {
        color: "#084F8C",
        fontSize: 15,
        fontWeight: "bold",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 25,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    dividerText: {
        marginHorizontal: 10,
        color: "#777",
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginHorizontal: 50,
    },
    socialIcon: {
        width: 50,
        height: 50,
    },
});