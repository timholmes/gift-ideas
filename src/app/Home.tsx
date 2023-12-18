import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import "firebase/compat/firestore";


function Home() {
  // const [userInfo, setUser] = useState<User | null>(null);
  // const [userData, setUserData ] = useState(null);
  // GoogleSignin.configure();

  // let firebaseApp: firebase.app.App;
  
  // if (!firebase.apps.length) {
  //   // firebase.initializeApp(firebaseConfig);
  //   firebaseApp = firebase.initializeApp(firebaseConfig)
  // }else {
  //   firebaseApp = firebase.app(); // if already initialized, use that one
  // }
  // const db: firebase.firestore.Firestore = firebaseApp.firestore()
  
  // const fetchUserInfo = async () => {

  //   console.log('silent');
  //   GoogleSignin.signInSilently()

  //   console.log('fetching');
  //   // const signedInReply = await GoogleSignin.isSignedIn()
  //   let userInfo: User | null;
  //   console.log('silent');
  //   userInfo = await GoogleSignin.signInSilently()
  //   console.log(`signed in ${JSON.stringify(await GoogleSignin.isSignedIn())}`);

  //   console.log('current');
  //   userInfo = await GoogleSignin.getCurrentUser();
  //   console.log(`current user ${JSON.stringify(userInfo)}`);
  //   setUser(userInfo)
  //   fetchUserData(userInfo)
  // }

  // const fetchUserData = async (userInfo: User | null) => {
  //   // const email = firebaseApp.auth().currentUser?.email
  //   // const firebaseApp = firebase.initializeApp(firebaseConfig)
  //   const db: firebase.firestore.Firestore = firebaseApp.firestore()
    
  //   console.log(userInfo?.user.email);
  //   const usersDoc = db.collection('users').doc('timdholmes@gmail.com');

  //   try {
  //     const user = await usersDoc.get();

  //     console.log(`got user ${JSON.stringify(user)}`);
  //   } catch(error) {
  //     console.log('oops');
  //     console.log(error);
  //   }
    // if(!user.data()) {
    //   usersDoc.set({firstName: 'michael'})
    // }
    // .then((querySnapshot) => {
    //     console.log(querySnapshot.data());
    // })
    // .catch(e => {
    //     console.log(e);
    //     // https://stackoverflow.com/questions/67010415/send-catch-error-state-from-child-to-parent-and-show-message
    //     console.log(e.message);
    //     // setErrorMessage(e.message);
    // });
  // }

  useEffect(() => {
    
    // fetchUserInfo();
    // getAuth()

  }, []);

  return (
    <View>
      <Text>
        Welcome, zzz.
      </Text>
    </View>
  )
}

export default Home;