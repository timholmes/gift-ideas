import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useReducer } from 'react';
import { Button, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
// import SignIn from './src/app/SignIn';
import { initializeApp, getApps, getApp, FirebaseApp } from '@firebase/app';
import { GoogleAuthProvider, signInWithCredential, getAuth } from '@firebase/auth';
import firebaseConfig from './firebase-config.json';
import { AuthenticationEvents, authenticationReducer, initialState } from './src/app/Authentication';

// import 'firebase/auth';
let firebaseApp: FirebaseApp;
const { Navigator, Screen } = createNativeStackNavigator();
// enum AuthenticationEvents {
//   BOOTSTRAP_COMPLETE,
//   SIGN_IN,
//   SIGN_OUT
// }

type Context = {
  signIn(): void;
  signOut(): void;
}
const AuthContext = React.createContext<Context>({
  signIn: function (): void {
  },
  signOut: function (): void {
  }
});

function initializeFirebaseApp() {
  console.log(getApps().length == 0);

  if(getApps().length == 0) {
  // if (firebase && !firebase?.getApps().length) {
    // firebase.initializeApp(firebaseConfig);
    console.log('return apps');
    return initializeApp(firebaseConfig.result.sdkConfig);
  } else {
    console.log('return app');
    return getApp(); // if already initialized, use that one
  }
}

export default function App({ navigation }: any) {
  const [state, dispatch]  = useReducer(authenticationReducer, initialState)
  // const [state, dispatch] = React.useReducer(
  //   (prevState: any, action: any) => {
  //     console.log(`${new Date()} \n dispatch: ${JSON.stringify(action)} prevState: ${JSON.stringify(prevState)}`);

  //     switch (action.type) {
  //       case AuthenticationEvents.BOOTSTRAP_COMPLETE:
  //         return {
  //           ...prevState,
  //           isLoading: false,
  //         };
  //       case AuthenticationEvents.SIGN_IN:
  //         return {
  //           ...prevState,
  //           isSignedIn: true,
  //           userInfo: action.userInfo
  //         }
  //       case AuthenticationEvents.SIGN_OUT:
  //         return {
  //           ...prevState,
  //           isSignedIn: false,
  //           userInfo: null
  //         }
  //     }
  //   }, {
  //     isLoading: true,
  //     isSignedIn: false,
  //     userInfo: null
  //   });

  // re-initialize firebase auth state
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      GoogleSignin.configure();
      
      console.log('effect');
      firebaseApp = initializeFirebaseApp();
      // const isSignedInReply = await GoogleSignin.isSignedIn()
      // const userInfo = await GoogleSignin.signInSilently()

      //simulate not previously signed-in
      dispatch({ type: AuthenticationEvents.BOOTSTRAP_COMPLETE, isSignedIn: false, userInfo: null })
    }

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        console.log('click signin');

        let googleUser = null;
        try {
          googleUser = await GoogleSignin.signIn();
        } catch (error) {
          console.log(error);
          throw new Error('Error logging in.  Check logs.')
        }

        // console.log(JSON.stringify(googleUser.idToken));

        // const credential = firebase.auth(firebaseApp).GoogleAuthProvider.credential(googleUser.idToken);
        // firebase.auth.
        const provider = GoogleAuthProvider.credential(googleUser.idToken)
        signInWithCredential(getAuth(), provider)
        // const c = p.credential(googleUser.idToken)
        // const prov = new auth.GoogleAuthProvider
        // auth.GoogleAuthProvider
        // const cred = prov.credential(googleUser.idToken)
        // const credential = provider

        // let signInResult
        // try {
        //    signInResult = await firebaseApp.auth().signInWithCredential(credential);
        // } catch (error) {
        //   console.log('firebase login error');
        // }
        

        dispatch({ type: AuthenticationEvents.SIGN_IN, userInfo: googleUser })
      },
      signOut: () => dispatch({ type: AuthenticationEvents.SIGN_OUT })
    }), []
  );


  function SignInScreen() {
    const { signIn } = React.useContext(AuthContext);
    return (
      <>
        <Text>{JSON.stringify(state)}</Text>
        <Button title="Sign In" onPress={signIn}></Button>
      </>
    )
  }

  function SignOutScreen() {
    const { signOut } = React.useContext(AuthContext);
    return (
      <>
        <View style={{ paddingEnd: 10 }}>
          <Button title="Sign Out" onPress={signOut} ></Button>
        </View>
      </>
    )
  }

  let landingScreen = null;
  if(state.isSignedIn) {
    landingScreen = <Screen name="Home" component={Home} />
  } else {
    landingScreen = <Screen name="SignInScreen" component={SignInScreen} />
  }

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider>
        <NavigationContainer>
          <Navigator screenOptions={{
            headerRight: () => (
              <SignOutScreen></SignOutScreen>
            )
          }}>
            {landingScreen}
          </Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );

}