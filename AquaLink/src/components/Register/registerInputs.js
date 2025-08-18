import React from "react";
import { 
    View, 
    TextInput,
    StyleSheet
} from "react-native";

export default function Inputs() {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#1081C7"
            />
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento"
                placeholderTextColor="#1081C7"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#1081C7"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#1081C7"
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirme sua Senha"
                placeholderTextColor="#1081C7"
                secureTextEntry={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: '20%',
    },
    input: {
        backgroundColor: 'white',
        borderColor: '#1081C7',
        borderWidth: 1,
        color: 'black',
        height: 50,
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
})