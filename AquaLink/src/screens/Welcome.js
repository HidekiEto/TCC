import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

import * as Animatable from 'react-native-animatable'

import { useNavigation } from '@react-navigation/native';

export default function Welcome(){
    const navigation = useNavigation()

    return (
        <View style={styles.container}>

            <Animatable.View delay={600} animation='fadeInUp' style={styles.containerContent}> 
                <Text style={styles.title}>Bem Vindo!</Text>
                <Text style={styles.text}>Sua experiência com{'\n'}Aqualink acaba de começar. </Text>

                <TouchableOpacity
                 style={styles.registerButton}
                 onPress={ () => navigation.navigate('Register')}
                 >
                    <Text style={styles.buttonText}>Nova Conta</Text>
                </TouchableOpacity>

                 <TouchableOpacity  
                    style={styles.signinButton}
                    onPress={() => navigation.navigate('Home')}
                    >
                    <Text style={styles.buttonText}>Já possuo uma Conta</Text>
                </TouchableOpacity>
            </Animatable.View>

            <View style={styles.containerImage}>
                <Animatable.Image style={styles.image}
                    animation='flipInY'
                    source={require('../assets/fitFemale.png')}
                    resizeMode='contain'

                />
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create ({
    container:{
        backgroundColor: '#1081C7',
        flex: 1,
    },
    containerContent: {
        flex: 3,
        paddingStart: '5%',
        paddingEnd: '5%',

    },
    title:{
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'poppins',
        marginTop: 80,
    },
    text: {
        fontSize: 23,
        color: '#fff',
        fontFamily: 'poppins',
        fontWeight: 'thin',
    },
    registerButton: {
       position: 'absolute',
       bottom: '15%',
       alignSelf: 'center',
       backgroundColor: '#27D5E8',
       width: '60%',
       borderRadius: 5,
       alignItems: 'center',
       paddingVertical: 8,
    },
    buttonText:{
        color: 'white',
        fontFamily: 'poppins'
        

    },
    signinButton: {
       alignSelf: 'center',
       position: 'absolute',
       bottom: '2%',
       borderBottomWidth: 1,
       borderBottomColor: 'white',
       
    },
    containerImage: {
        flex: 3,
        backgroundColor: '#1081C7',
    },
    image: {
        width: '100%',
        marginTop: 40,
    }
})