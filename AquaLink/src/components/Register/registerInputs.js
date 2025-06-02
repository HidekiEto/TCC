import { 
    View, 
    TextInput,
    StyleSheet
} from "react-native";

import React from "react";

export default function Inputs(){
    return (
        <View style={styles.container}>
            <TextInput style={styles.inputName}>
                Nome Completo
            </TextInput>

            <TextInput style={styles.inputNasc}>
                Data de Nascimento
            </TextInput>

            <TextInput style={styles.inputEmail}>
                Email
            </TextInput>

            <TextInput style={styles.inputSenha}>
                Senha
            </TextInput>

            <TextInput style={styles.inputSenha2}>
                Confirme sua Senha
            </TextInput>
        </View>
    );
}

const styles = StyleSheet.create ({
    container:{
        backgroundColor: 'white',
    },
    inputName: {
        backgroundColor: 'red',
        fontSize: 5,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 1,
        width: '60%',
    },
    inputNasc: {
        backgroundColor: 'red',
        fontSize: 5,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 1,
        width: '60%',
    },
    inputEmail: {
        backgroundColor: 'red',
        fontSize: 5,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 1,
        width: '60%',
    },
    inputSenha: {
        backgroundColor: 'red',
        fontSize: 5,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 1,
        width: '60%',
    },
    inputSenha2: {
        backgroundColor: 'red',
        fontSize: 5,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 1,
        width: '60%',
    }
})