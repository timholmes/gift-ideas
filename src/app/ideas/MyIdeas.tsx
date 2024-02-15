import { useFocusEffect } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { Firestore, QuerySnapshot, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AnimatedFAB } from "react-native-paper";
import { AppContext } from "../AppContext";
import { Idea } from "../Types";
import { FirebaseUtils } from "../util/FirebaseUtils";
import { SwipeableItem, SwipeableItemEvents } from "../SwipeableItem";

const ideas: Idea[] = [];
const initialState = {
    ideas: ideas
}

export default function MyIdeas({ route, navigation }: any) {
    const appContext = useContext(AppContext);
    const [state, setState] = useState(initialState)

    let db: Firestore;

    enum FirestoreErrorCodes {
        PERMISSION_DENIED = 'permission-denied'
    }

    useEffect(() => {
        DeviceEventEmitter.addListener(SwipeableItemEvents.DELETE_PRESS, (swipeable: Swipeable) => { handleDeletePress(swipeable) })
        DeviceEventEmitter.addListener(SwipeableItemEvents.ITEM_PRESS, (idea: Idea) => { handleItemPress(idea) })
    
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
        console.log(`my ideas: load useContext? ${useContext}`);

        if (useContext) {

            setState({ ...appContext });

        } else {    // reload data from firebase

            console.log('getting ideas from firebase');
            db = FirebaseUtils.getFirestoreDatabase();

            // TODO: show a a critical error and force login
            if (!appContext.userInfo) {
                return;
            }

            // TODO: simplify firestore query to path based
            let docRef = undefined;
            try {
                docRef = doc(db, "users", appContext.userInfo.email)
            } catch (error) {
                console.log('Unable to get users document reference.', error);
            }

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

                let querySnapshot: QuerySnapshot = await getDocs(collection(docRef, "ideas"));

                let newIdeas: Idea[] = [];
                querySnapshot.forEach((doc) => {

                    let idea: Idea = {
                        id: doc.id,
                        title: doc.data().title,
                        description: doc.data().description
                    }
                    newIdeas.push(idea)
                });

                setState({ ...state, ideas: newIdeas });
     
                appContext.ideas = newIdeas;
            }

        }
    }
    
    async function handleDeletePress(swipeable: Swipeable) {
        const id: string | undefined = swipeable?.props?.id?.toString()
        if (id && appContext.userInfo?.email) {

            db = FirebaseUtils.getFirestoreDatabase();
            try {
                console.log(appContext.userInfo?.email);
                const ideaDocRef = doc(db, "users", appContext.userInfo?.email, "ideas", id)
                await deleteDoc(ideaDocRef);

                onLoad(false)
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleItemPress = (idea: any) => {
        navigation.navigate('AddIdea', { idea: idea})
    }

    const ideasList = () => {
        return state.ideas.map((idea, index) =>
            <SwipeableItem key={index} id={idea.id} title={idea.title} description={idea.description} data={idea} icon="lightbulb"></SwipeableItem>
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