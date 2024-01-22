import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "./AppContext";

export default function Home(props: any) {

  const userContext = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Text>
        Welcome, { userContext.userInfo.email }.
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