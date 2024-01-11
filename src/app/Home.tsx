import { FirebaseError } from "firebase/app";
import { QuerySnapshot, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { FirebaseUtils } from "./FirebaseUtils";
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
    fetchUserData();

  }, []);

  return (
    <View>
      <Text>
        Welcome, {props.userInfo.firstName}.
      </Text>
      <Ideas></Ideas>
    </View>
  )
}

export default Home;