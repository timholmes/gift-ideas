import { FirebaseError } from "firebase/app";
import { Firestore, QuerySnapshot, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { GestureResponderEvent, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AnimatedFAB, List } from "react-native-paper";
import { FirebaseUtils } from "../util/FirebaseUtils";
import { Idea, UserContext } from "../AppContext";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const ideas: Idea[] = [];
const initialState = {
    ideas: ideas
}

export default function MyIdeas({ route, navigation }: any) {
    const userContext = useContext(UserContext);
    const [state, setState] = useState(initialState)

    let db: Firestore;

    enum FirestoreErrorCodes {
        PERMISSION_DENIED = 'permission-denied'
    }

    // called when params are changed.  1st - when params are undefined on load, 2nd - when navigating back from another screen
    useFocusEffect(
        useCallback(
            () => {
                console.log('myideas - focus effect');

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

            setState({ ...userContext });

        } else {    // reload data from firebase

            console.log('getting ideas from firebase');
            db = FirebaseUtils.getFirestoreDatabase();

            // TODO: show a a critical error and force login
            if (!userContext.userInfo) {
                return;
            }

            // TODO: simplify firestore query to path based
            let docRef = undefined;
            try {
                docRef = doc(db, "users", userContext.userInfo.email)
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
     
                userContext.ideas = newIdeas;
            }

        }
    }
    
    async function deletePress(swipeable: Swipeable) {
        const id: string | undefined = swipeable?.props?.id?.toString()
        if (id && userContext.userInfo?.email) {

            db = FirebaseUtils.getFirestoreDatabase();
            try {
                console.log(userContext.userInfo?.email);
                const ideaDocRef = doc(db, "users", userContext.userInfo?.email, "ideas", id)
                await deleteDoc(ideaDocRef);

                onLoad(false)
            } catch (error) {
                console.error(error);
            }
        }
    }

    const rightSwipeActions = (progressAnimatedValue: any, dragAnimatedValue: any, swipeable: Swipeable) => {
        return (
            <View
                style={{
                    backgroundColor: '#ff8303',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <Text
                    onPress={() => {
                        deletePress(swipeable);
                    }}
                    style={{
                        color: '#1b1a17',
                        fontWeight: '600',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                    }}
                >
                    Delete
                </Text>
            </View>
        );
    };

    const ideasList = () => {
        return state.ideas.map((idea, index) =>
            <Swipeable key={idea.id}
                id={idea.id}
                renderRightActions={rightSwipeActions}
            >
                <List.Item
                    key={idea.id}
                    title={idea.title}
                    description={idea.description}
                    left={props => <List.Icon {...props} icon="lightbulb" />}
                    id={idea.id}
                    onPress={() => navigation.navigate('AddIdea', {
                        idea: idea
                    })}
                />
            </Swipeable>
        )
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