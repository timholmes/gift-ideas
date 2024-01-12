import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { MD2Colors } from "react-native-paper";
import { Screen } from "react-native-screens";

export default function LoadingOverlay(props: any) {
    return (
        <View style={styles.centered}>
            <ActivityIndicator animating={true} color={MD2Colors.red800} />
            {/* <Text>{state.userMessage}</Text> */}
        </View>
    )
}


const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
