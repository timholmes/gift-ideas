import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useReducer, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
// import SignIn from './src/app/SignIn';
import { initializeApp, getApps, getApp, FirebaseApp } from '@firebase/app';
import { GoogleAuthProvider, signInWithCredential, getAuth } from '@firebase/auth';
import firebaseConfig from './firebase-config.json';

let firebaseApp: FirebaseApp;
const { Navigator, Screen } = createNativeStackNavigator();
const initialState = {
  isLoading: true,
  isSignedIn: false,
  userInfo: {}
}

function initializeFirebaseApp() {
  if (getApps().length == 0) {
    return initializeApp(firebaseConfig.result.sdkConfig);
  } else {
    return getApp(); // if already initialized, use that one
  }
}

export default function App({ navigation }: any) {
  const [state, setState] = useState({
    isLoading: true,
    isSignedIn: false,
    userInfo: {}
  })

  // re-initialize firebase auth state
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      GoogleSignin.configure();

      firebaseApp = initializeFirebaseApp();

      setState(await bootstrapComplete());
    }

    bootstrapAsync();
  }, []);

  async function bootstrapComplete() {
    return { ...initialState, isLoading: false }
  }

  async function signIn() {
    let googleUser = null;
    try {
      googleUser = await GoogleSignin.signIn();
    } catch (error) {
      console.log(error);
      throw new Error('Error logging in.  Check logs.')
    }
    const provider = GoogleAuthProvider.credential(googleUser.idToken)
    signInWithCredential(getAuth(), provider)

    setState({ ...initialState, userInfo: googleUser, isSignedIn: true })
  }

  function signOut() {
    GoogleSignin.signOut().then(() => {
      setState({ ...initialState, userInfo: {}, isSignedIn: false });
    })
    .catch((e) => {
      console.error('Sign out failed.', e);
      // TODO: show error to user
    });
  }


  function SignInScreen(props: any) {
    return (
      <>
        <Text>{JSON.stringify(state)}</Text>
        <Button title="Sign In" onPress={signIn}></Button>
      </>
    )
  }

  function SignOutScreen() {
    return (
      <>
        <View style={{ paddingEnd: 10 }}>
          <Button title="Sign Out" onPress={signOut} ></Button>
        </View>
      </>
    )
  }

  let landingScreen = null;
  if (state.isSignedIn) {
    landingScreen = <Screen name="Home">
      {(props) => <Home {...props} userInfo={state.userInfo} />}
    </Screen>
  } else {
    landingScreen = <Screen name="SignInScreen" component={SignInScreen} />
  }

  return (
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
  );

}