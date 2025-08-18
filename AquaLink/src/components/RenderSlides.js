import { 
    View,
    Text, 
    Image,
    StyleSheet
} from 'react-native';

export default function RenderSlides({ item }) {
    return (
        <View style={[styles.container, { backgroundColor: item.backgroundColor }]}>
            {item.topContent ? (
                <View style={styles.topContent}>
                    {item.component && item.component}
                    {item.text && <Text style={styles.slideText}>{item.text}</Text>}
                </View>
            ) : (
                <View style={styles.centered}>
                    {item.component && item.component}
                    {item.text && <Text style={styles.slideText}>{item.text}</Text>}
                    {item.image && <Image source={item.image} style={styles.image} />}
                </View>
            )}
        </View>
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
    image: {
        width: 150,
        height: 150,
        margin: 50,
    },
});