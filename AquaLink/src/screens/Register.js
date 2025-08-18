import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Inputs from '../components/Register/registerInputs';

export default function Register(){
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Vamos te cadastrar.</Text>
                <Text style={styles.text}>Insira suas informações!</Text>
                
            <Inputs/>
        </View>

        </View>
    );
}

const styles = StyleSheet.create ({
    container: {
        backgroundColor: '#1081C7',
        flex: 1,
    },
    textContainer:{ 
        paddingEnd: '5%',
        paddingStart: '5%',
        flex: 1,
    },
    title: {
        marginTop: 80,
        color: 'white',
        fontWeight: 'Bold',
        fontSize: 35,
    },
    text: {
        color: 'white',
        fontSize: 20,
    }
})