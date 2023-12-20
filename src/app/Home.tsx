import { doc, getDoc, getFirestore, FirestoreErrorCode, FirestoreError, collection, CollectionReference, getDocs, QuerySnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { FirebaseUtils } from "./FirebaseUtils";
import { FirebaseError } from "firebase/app";


enum FirestoreErrorCodes {
  PERMISSION_DENIED = 'permission-denied'
}

function Home(props: any) {
  const firebaseApp = FirebaseUtils.initialize();

  const fetchUserData = async () => {
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "users", props.userInfo.user.email)

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
    

    // doc(colref)


    // console.log(JSON.stringify(userDocument?.data()));
    // const users = collection(db, 'users');
    // const documentReference: DocumentReference = doc(collection(db, "users"), 'timdholmes@gmail.com');
    // console.log(documentReference.id);

    // const doc = getDoc(documentReference)

    // JSON.stringify(doc)
    // JSON.stringify((await getDoc(documentReference)).data())
    // console.log(JSON.stringify(q));
    // const querySnapshot = await getDocs(q);

    // console.log(querySnapshot.size);
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log('here');
    //   console.log(doc.id, " => ", doc.data());
    // });
    // console.log(JSON.stringify(users));
    // CollectionReference

    // const usersDoc = db.collection('users').doc('timdholmes@gmail.com');
    // try {
    //   const user = await usersDoc.get();

    //   console.log(`got user ${JSON.stringify(user)}`);
    // } catch (error) {
    //   console.log('oops');
    //   console.log(error);
    // }

    // if (!user.data()) {
    //   usersDoc.set({ firstName: 'michael' })
    // }
    // .then((querySnapshot) => {
    //   console.log(querySnapshot.data());
    // })
    // .catch(e => {
    //   console.log(e);
    //   // https://stackoverflow.com/questions/67010415/send-catch-error-state-from-child-to-parent-and-show-message
    //   console.log(e.message);
    //   // setErrorMessage(e.message);
    // });
  }

  useEffect(() => {

    // fetchUserInfo();
    fetchUserData();

  }, []);

  return (
    <View>
      <Text>
        Welcome, {props.userInfo.user.givenName}.
      </Text>
    </View>
  )
}

export default Home;