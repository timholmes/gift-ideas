import { doc, getDoc, getFirestore, FirestoreErrorCode, FirestoreError, collection, CollectionReference, getDocs, QuerySnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { FirebaseUtils } from "./FirebaseUtils";
import { FirebaseError } from "firebase/app";
import { List } from "react-native-paper";


enum FirestoreErrorCodes {
  PERMISSION_DENIED = 'permission-denied'
}

function Home(props: any) {
  const firebaseApp = FirebaseUtils.initialize();

  const fetchUserData = async () => {
    const db = getFirestore(firebaseApp);
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
        <List.Item
          title="First Item"
          description="Item description"
          left={props => <List.Icon {...props} icon="folder" />}
        />
      </Text>
    </View>
  )
}

export default Home;