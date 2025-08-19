import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { size } from '@shopify/react-native-skia';


export default function HomeFooter({ activeScreen }) {
    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.iconContainer}>
                <Ionicons
                    name="calendar"
                    size={24}
                    color={activeScreen === 'Calendario' ? '#FFD700' : 'white'}
                />
                <Text
                    style={[
                        styles.iconText,
                        activeScreen === 'Calendario' && styles.activeText,
                    ]}
                >
                    Calendário
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer}>
                <Ionicons
                    name="water"
                    size={24}
                    color={activeScreen === 'Aqualink' ? '#FFD700' : 'white'}
                />
                <Text
                    style={[
                        styles.iconText,
                        activeScreen === 'Aqualink' && styles.activeText,
                    ]}
                >
                    Aqualink
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer}>
                <Ionicons
                    name="home"
                    size={24}
                    color={activeScreen === 'Home' ? '#082862' : 'white'}
                    style={[
                        activeScreen === 'Home' ? styles.activeScreen  : {}
                    ]}
                />
                <Text
                    style={[
                        styles.iconText,
                        activeScreen === 'Home' && styles.activeText,
                    ]}
                >
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer}>
                <FontAwesome
                    name="user"
                    size={24}
                    color={activeScreen === 'Perfil' ? '#FFD700' : 'white'}
                />
                <Text
                    style={[
                        styles.iconText,
                        activeScreen === 'Perfil' && styles.activeText,
                    ]}
                >
                    Perfil
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer}>
                <FontAwesome
                    name="trophy"
                    size={24}
                    color={activeScreen === 'Conquistas' ? '#FFD700' : 'white'}
                />
                <Text
                    style={[
                        styles.iconText,
                        activeScreen === 'Conquistas' && styles.activeText,
                    ]}
                >
                    Conquistas
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        padding: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        
    },
    iconText: {
        fontSize: 13,
        color: 'white',

    },
    activeText: {
        color: '#082862',
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeScreen: {
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 30,
        height: 50,
        width: 50,
        justifyContent: 'center',  
        alignItems: 'center',
        textAlign: 'center',                                                     
        backgroundColor: 'white', // Light background for active screen
        shadowOffset: {
            width: 0,
            height: 2,
        },

       
    },
});