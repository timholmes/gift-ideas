import { doc, getDoc, getFirestore, FirestoreErrorCode, FirestoreError, collection, CollectionReference, getDocs, QuerySnapshot, connectFirestoreEmulator } from "firebase/firestore";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { FirebaseUtils } from "./FirebaseUtils";
import { FirebaseError } from "firebase/app";
import { List } from "react-native-paper";
import Ideas from "./Ideas";


enum FirestoreErrorCodes {
  PERMISSION_DENIED = 'permission-denied'
}

function Home(props: any) {
  const fetchUserData = async () => {
    const db = FirebaseUtils.getFirestoreDatbase();
    const docRef = doc(db, "users", props.userInfo.email)

    let userDocument = null;
    try {
      userDocument = await getDoc(docRef) // do this to determine permission?
    } catch (error: any) {
      if(error instanceof FirebaseError && error.code == FirestoreErrorCodes.PERMISSION_DENIED) {
        console.log('Permission denied accessing user document.');
      }
      return;
    }

    let ideasCollection: QuerySnapshot = await getDocs(collection(docRef, "ideas"));

    console.log(JSON.stringify(ideasCollection.size));
  }

  useEffect(() => {

    // fetchUserInfo();
    fetchUserData();

  }, []);

  return (
    <View>
      <Text>
        Welcome, {props.userInfo.displayName}.
      </Text>
      <Ideas></Ideas>
    </View>
  )
}

export default Home;