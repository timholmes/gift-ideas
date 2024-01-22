import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home(props: any) {

  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Text>
        Welcome, { props.route.params.firstName }.
        {'\n'}
      </Text>
    </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1
  }
});