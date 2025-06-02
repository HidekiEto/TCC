import { Text, StyleSheet } from "react-native";

const Title = () => {
    return (
        <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Aqua</Text>
            <Text>Link</Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 50,
        position: 'absolute',
        bottom: '50%',
        color: 'white'
    }
})

export default Title;