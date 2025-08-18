import { 
    Text,
    Image,
    StyleSheet,
    View,
} from "react-native";

import Title from "../components/Title";


const SecondSlider = () => {
    return(
        <View style={styles.container}>
            <Title/>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'red'
    },
})

export default SecondSlider;