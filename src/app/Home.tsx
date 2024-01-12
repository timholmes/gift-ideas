import { Text, View } from "react-native";

function Home(props: any) {

  return (
    <View>
      <Text>
        Welcome, {props.route.params.firstName}.
        {'\n'}
      </Text>
    </View>
  )
}

export default Home;