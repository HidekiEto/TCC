import { Text, View } from "react-native";
import  BottomMenu  from "../components/BottomNavigation";

export default function Achievements(){
    return (
        <View className="flex-1">
            <Text> Conquistas </Text>
            <BottomMenu/>
        </View>
        
    );
}