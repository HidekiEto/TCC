import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Inputs from '../components/Register/registerInputs';

import { LinearGradient } from 'expo-linear-gradient';
import CheckBox from '../components/CheckBox';

export default function Register() {
    const [checked, setChecked] = useState(false);

    return (
        <LinearGradient
            colors={['#1081C7', '#FFFF']}
            style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Vamos te cadastrar.</Text>
                <Text style={styles.text}>Insira suas informações!</Text>
                <Inputs />
                <CheckBox
                    checked={checked}
                    onChange={setChecked}
                    label="Manter conectado"
                />
                <TouchableOpacity style={styles.button} onPress={() => './Home'}>
                    <Text style={styles.buttonText}>Criar Conta</Text>
                </TouchableOpacity>
                <Text style={styles.infoText}>
                    Ao criar uma conta, você concorda com a{' '}
                    <Text style={styles.underlineText}>política de privacidade</Text>
                    {' '}e aceita os{' '}
                    <Text style={styles.underlineText}>termos e condições</Text>
                    {' '}do Aqualink
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1081C7',
        flex: 1,
    },
    textContainer: {
        paddingEnd: '5%',
        paddingStart: '5%',
        flex: 1,
    },
    title: {
        marginTop: 80,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35,
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    button: {
        backgroundColor: '#27D5E8',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width: '70%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '100',
        marginTop: 10,
    },
    underlineText: {
        textDecorationLine: 'underline',
    }
})