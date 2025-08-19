import { 
    View,
    Text, 
    Image,
    StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RenderSlides({ item }) {
    return (
        <LinearGradient
            colors={['#084F8C', '#27D5E8']}
            style={styles.container}
        >
            {item.topContent ? (
                <View style={styles.topContent}>
                    {item.component && item.component}
                    {item.text && <Text style={styles.slideText}>{item.text}</Text>}
                </View>
            ) : (
                <View style={styles.centered}>
                    {item.component && item.component}
                    {item.text && <Text style={styles.slideText}>{item.text}</Text>}
                    {item.image && <Image source={item.image}/>}
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
    },
    topContent: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flex: 1,
        marginTop: 60,
    },
    slideText: {
        color: 'white',
        fontSize: 28,
        textAlign: 'center',
        fontWeight: 'normal',
        marginTop: 10,
    },

});