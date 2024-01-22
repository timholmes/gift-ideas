import { useEffect } from "react";
import { Text, View } from "react-native";


export function AddIdea({ navigation }: any ) {

    useEffect(() => {
        console.log(navigation);
    
      }, []);

    return (
        <View>
            <Text>
                add idea
            </Text>
        </View>
    )

}