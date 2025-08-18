import { 
    Text, 
    StyleSheet,
    View,
} from "react-native";

const Title = () => {
    return (
        <View style={styles.view}>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 50 }}>Aqua</Text>
            <Text style={{ fontWeight: 'normal', color: 'white', fontSize: 50 }}>Link</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flexDirection: "row",
    }
})

export default Title;