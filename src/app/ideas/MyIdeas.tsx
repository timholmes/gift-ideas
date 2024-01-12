import { View } from "react-native";
import { Text } from "react-native-paper";
import IdeasList from "./IdeasList";
import { FirebaseUtils } from "../util/FirebaseUtils";
import { QuerySnapshot, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useEffect } from "react";


export default function MyIdeas(props: any) {

    enum FirestoreErrorCodes {
        PERMISSION_DENIED = 'permission-denied'
    }

    const fetchUserData = async () => {
        const db = FirebaseUtils.getFirestoreDatbase();
        const docRef = doc(db, "users", props.userInfo?.email)

        let userDocument = null;
        try {
            userDocument = await getDoc(docRef) // do this to determine permission?
        } catch (error: any) {
            if (error instanceof FirebaseError && error.code == FirestoreErrorCodes.PERMISSION_DENIED) {
                console.log('Permission denied accessing user document.');
            }
            return;
        }

        let ideasCollection: QuerySnapshot = await getDocs(collection(docRef, "ideas"));

        console.log(JSON.stringify(ideasCollection.size));
    }

    useEffect(() => {
        fetchUserData();

    }, []);

    return (
        <View>
            <IdeasList></IdeasList>
        </View>
    )

}