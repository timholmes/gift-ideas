import { useFocusEffect } from "@react-navigation/native";
import { Firestore } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { AnimatedFAB, Text } from "react-native-paper";
import { AppContext } from "../AppContext";
import { SwipeableItem, SwipeableItemEvents } from "../shared/SwipeableItem";
import { findAllConnections } from "./ConnectionsService";
import { crudListStyles } from "../shared/ApplicationStyles";
import { Swipeable } from "react-native-gesture-handler";
import { Sharing, initialContext } from "../Types";

// const initialState = {
//     sharing: {
//         view: {
//             users: []
//         }
//     }
// }

export default function ListConnections({ route, navigation }: any) {
    const appContext = useContext(AppContext);
    const [state, setState] = useState(initialContext)

    let db: Firestore;

    useEffect(() => {
        DeviceEventEmitter.addListener(SwipeableItemEvents.DELETE_PRESS, (swipeable: Swipeable) => { });
        DeviceEventEmitter.addListener(SwipeableItemEvents.ITEM_PRESS, (swipeable: Swipeable) => { return;});  // catch it but do nothing 
    
        return () => {
          DeviceEventEmitter.removeAllListeners();
        };
    
      }, []);

    // called when params are changed.  1st - when params are undefined on load, 2nd - when navigating back from another screen
    useFocusEffect(
        useCallback(
            () => {
                if (route.params && route.params.refreshContent) {
                    onLoad(true);
                } else {
                    onLoad();
                }

            }, [route.params])
    );

    async function onLoad(useContext: boolean = false) {
        console.log(`list connections: load useContext? ${useContext}`);

        if (useContext) {

            setState( { ...appContext });

        } else {    // reload data from firebase
            
            // TODO: show a a critical error and force login
            if (!appContext.userInfo) {
                console.error("Unexpected userInfo is empty.");
                return;
            }

            try {
                let viewUsers: string[] = await findAllConnections(appContext.userInfo.email)

                let sharing: Sharing = {
                    view: {
                        users: viewUsers
                    }
                }
                setState({ ...state, sharing: sharing})
                appContext.sharing = sharing;
                
            } catch (error) {
                console.error("Cannot get list of connections", error);
            }

        }
    }
    
    // async function handleDeletePress(swipeable: Swipeable) {
    //     const id: string | undefined = swipeable?.props?.id?.toString()
    //     if (id && userContext.userInfo?.email) {

    //         db = FirebaseUtils.getFirestoreDatabase();
    //         try {
    //             console.log(userContext.userInfo?.email);
    //             const ideaDocRef = doc(db, "users", userContext.userInfo?.email, "ideas", id)
    //             await deleteDoc(ideaDocRef);

    //             onLoad(false)
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // }

    const ideasList = () => {
        return state.sharing.view.users.map((item, index) =>
            // <SwipeableItem id={item} key={index}></SwipeableItem>
            <SwipeableItem key={index} id={item} title={item} description="" data="item" icon="account"></SwipeableItem>
        );
    }

    return (
        <SafeAreaView style={crudListStyles.container}>
            <View style={crudListStyles.list}>
                <Text>Below is the list of users that have access to your ideas.</Text>
                <ScrollView>
                {ideasList()}
                </ScrollView>
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => navigation.navigate('AddConnection')}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    style={[crudListStyles.fabStyle]}
                />
            </View>
        </SafeAreaView>
    )
}