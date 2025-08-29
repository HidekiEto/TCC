import { Text, View } from "react-native";
import { BottomMenu } from "../components/BottomNavigation";
import AvatarComponent from "../components/ProfileComponents/Avatar";

export default function Profile(){
    return (
        <View className="flex-1">
            <Text> Perfil </Text>
            <AvatarComponent />
            <BottomMenu/>
        </View>
        
    );
}