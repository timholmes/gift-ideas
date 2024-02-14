import { useFocusEffect } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { Firestore, QuerySnapshot, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AnimatedFAB, Text } from "react-native-paper";
import { UserContext } from "../AppContext";
import { Idea, Sharing } from "../Types";
import { FirebaseUtils } from "../util/FirebaseUtils";
import { SwipeableItem, SwipeableItemEvents } from "../SwipeableItem";

const initialState = {
    connections: []
}

export default function ListConnections({ route, navigation }: any) {
    const userContext = useContext(UserContext);
    const [state, setState] = useState(initialState)

    let db: Firestore;

    enum FirestoreErrorCodes {
        PERMISSION_DENIED = 'permission-denied'
    }

    useEffect(() => {
        // DeviceEventEmitter.addListener(SwipeableIdeaEvents.DELETE_PRESS, (swipeable: Swipeable) => { handleDeletePress(swipeable) })
        // DeviceEventEmitter.addListener(SwipeableIdeaEvents.ITEM_PRESS, (idea: Idea) => { navigation.navigate('AddIdea', { idea: idea} ) })
    
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

            setState({ ...userContext });

        } else {    // reload data from firebase

            console.log('not using cache');

            db = FirebaseUtils.getFirestoreDatabase();

            // TODO: show a a critical error and force login
            if (!userContext.userInfo) {
                console.error("Unexpected userInfo is empty.")
                return;
            }

            // TODO: simplify firestore query to path based
            let docRef = undefined;
            try {
                docRef = doc(db, "users", userContext.userInfo.email, "sharing", "view")
            } catch (error) {
                console.log('Unable to get users document reference.', error);
            }

            console.log('got doc');
            
            if (docRef != undefined) {
                let userDocument = null;
                try {
                    userDocument = await getDoc(docRef) // do this to determine permission?

                } catch (error: any) {
                    if (error instanceof FirebaseError && error.code == FirestoreErrorCodes.PERMISSION_DENIED) {
                        console.log('Permission denied accessing user document.');
                    }

                    console.error('Cannot read users document.', error)
                    return;
                }
                let viewUsers: any = userDocument.data()?.users

                setState({ ...state, connections: viewUsers})
                userContext.connections = viewUsers;
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
        return state.connections.map((item, index) =>
            // <SwipeableItem id={item} key={index}></SwipeableItem>
            <SwipeableItem key={index} id={item} title={item} description="" icon="account"></SwipeableItem>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.list}>
                <ScrollView>
                {ideasList()}
                </ScrollView>
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => navigation.navigate('AddIdea')}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    style={[styles.fabStyle]}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        flexGrow: 1,
    },
    fabStyle: {
        bottom: 0,
        right: 16,
        position: 'absolute',
    },
});