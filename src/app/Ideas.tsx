import { View } from "react-native";
import { List } from "react-native-paper";

function Ideas(props: any) {

    return (
        <View>
          <List.Item
            title="First Item"
            description="Item description"
            left={props => <List.Icon {...props} icon="lightbulb" />}
          />
        </View>
      )

}

export default Ideas;