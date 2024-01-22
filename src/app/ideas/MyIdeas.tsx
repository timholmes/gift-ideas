import { FirebaseError } from "firebase/app";
import { Firestore, QuerySnapshot, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AnimatedFAB, List } from "react-native-paper";
import { FirebaseUtils } from "../util/FirebaseUtils";

const ideas: any[] = [];
const initialState = {
    ideas: ideas
}

export default function MyIdeas(props: any) {
    const [state, setState] = useState(initialState)
    let db: Firestore;

    enum FirestoreErrorCodes {
        PERMISSION_DENIED = 'permission-denied'
    }

    useEffect(() => {
        console.log(props);
        onLoad();
    }, []);

    async function onLoad() {
        db = FirebaseUtils.getFirestoreDatbase();

        let docRef = undefined;
        try {
            docRef = doc(db, "users", props.route.params.email)
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

            let idea: any[] = [];
            querySnapshot.forEach((doc) => {
                idea.push({
                    id: doc.id,
                    data: doc.data()
                })
            });

            setState({ ideas: idea });
        }
    }
    const rightSwipeActions = (progressAnimatedValue: any, dragAnimatedValue: any, swipeable: Swipeable) => {

        async function deletePress() {
            console.log('***** press');
            console.log(swipeable.props.id);
            const id: string | undefined = swipeable?.props?.id?.toString()
            if(id) {

                try {
                    // const docRef = doc(db, "users", props.route.params.email)
                    // console.log('ref');
                    // console.log(docRef);
                    // await deleteDoc(doc(db, "users", props.route.params.email))
                } catch(error) {
                    console.error(error);
                }
            }
        }
    
        return (
            <View
                style={{
                    backgroundColor: '#ff8303',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <Text
                    onPress={deletePress}
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
                    title={idea.data.title}
                    description="Item description"
                    left={props => <List.Icon {...props} icon="lightbulb" />}
                    id={idea.id}
                />
            </Swipeable>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.list}>
                {ideasList()}
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => props.navigation.navigate('AddIdea')}
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