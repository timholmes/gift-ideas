import { useContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "./AppContext";
import { Button } from "react-native-paper";

export default function Home({ route, navigation}: any) {

  const appContext = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.welcome}>
          Welcome, {appContext.userInfo?.firstName}.
          {'\n'}
        </Text>
        <Text style={styles.title}>
          To invite someone to your ideas, click below.
        </Text>
        <Button
          onPress={() => navigation.navigate('Sharing')}
          mode="contained"
          style={styles.button}
        >Add</Button>
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  welcome: {
    fontSize: 18
  },
  title: {
    marginVertical: 8,
    fontSize: 16
  },
  button: {
    width: 100,
    margin: 10,
    alignContent: 'center'
  }
});