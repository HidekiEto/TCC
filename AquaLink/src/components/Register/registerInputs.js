import { 
    View, 
    TextInput,
    StyleSheet
} from "react-native";


export default function Inputs(){
    return (
        <View style={styles.container}>
            <TextInput
             style={styles.input}
            placeholderTextColor="#C0C0C0"
            placeholder={" Nome Completo "}
            onChange={() => {""}}
             />
                Nome Completo

            <TextInput style={styles.input}>
                Data de Nascimento
            </TextInput>

            <TextInput style={styles.input}>
                Email
            </TextInput>

            <TextInput style={styles.input}>
                Senha
            </TextInput>

            <TextInput 
            style={styles.input}
            secureTextEntry={true}
            >
                Confirme sua Senha
            </TextInput>
        </View>
    );
}

const styles = StyleSheet.create ({
    container:{
        backgroundColor: 'blue',
        flex: 1,
        padding: 20,
        
    },
    input: {
        backgroundColor: 'white',
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
})