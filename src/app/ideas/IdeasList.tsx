import { View } from "react-native";
import { List, Text } from "react-native-paper";
import LoadingOverlay from "../util/LoadingOverlay";

function IdeasList(props: any) {

  console.log(`ideas list props: ${props.ideas.length}`);
  return (
    <View>
      <Text>here: {props.ideas.length}</Text>
    </View>
  )
  // console.log('here*******');
  // console.log(JSON.stringify(props.ideas));

  // props.ideas.forEach((prop: any, key: any) => {
  //   console.log('test');
  // })

  // if (!props.ideas.size || props.ideas.size <= 0) {
  //   return (
  //     <View>
  //       {/* {props.ideas.forEach((item: any) => { 
  //           return (<List.Item
  //             title="First Item"
  //             description="Item description"
  //             left={props => <List.Icon {...props} icon="lightbulb" />}
  //           />)
  //         })} */}
  //       <LoadingOverlay></LoadingOverlay>
  //     </View>
  //   )
  // } else {
  //   return (
  //     <View><Text>Test22</Text></View>
  //   )
  // }
}

export default IdeasList;