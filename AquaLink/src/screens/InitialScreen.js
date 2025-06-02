import { 
    Text, 
    View,
    StyleSheet
} from "react-native";

import { LinearGradient } from 'expo-linear-gradient';

import Title from "../components/Title";

export default function InitialScreen(){
    return(
        <LinearGradient
            colors={['#084F8C', '#27D5E8']}
            style={styles.container}>

                <Title/>  
                
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
    },
})