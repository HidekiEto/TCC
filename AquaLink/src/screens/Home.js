import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Title from '../components/Title';
import { LiquidGauge } from '../components/WaterCircle';

export default function Home() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#27D5E8' }}>
            <LinearGradient
                colors={['#084F8C', '#27D5E8']}
                style={styles.containerHeader}
            > 
                <Title />
            </LinearGradient>
            <View style={styles.containerHome}> 
                <Text style={{ fontSize: 24, fontWeight: 'bold'}}>Olá, Samuel,</Text>
                <Text style={{ fontSize: 16, marginBottom: 20 }}>Bem vindo ao Aqualink.</Text>
                    
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#084F8C'}}>Meta diária</Text>
                        <LiquidGauge/>
                        <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: '#084F8C', borderRadius: 20, width: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
                            <Text style={styles.textButton}>Adicionar Água</Text>
                        </TouchableOpacity>
                        
                    </View>
                

            </View>
        </View>
    );
}

const styles = {
    containerHeader: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    containerHome: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    textButton: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'poppins',
    },
}