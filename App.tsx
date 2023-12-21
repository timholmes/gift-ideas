import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, MD2Colors, PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
// import SignIn from './src/app/SignIn';
import { GoogleAuthProvider, getAuth, signInWithCredential, connectAuthEmulator, initializeAuth } from 'firebase/auth';
import { FirebaseUtils } from './src/app/FirebaseUtils';

const { Navigator, Screen } = createNativeStackNavigator();
const initialState = {
  isLoading: true,
  isSignedIn: false,
  userInfo: {},
  userMessage: ''
}

export default function App({ navigation }: any) {
  const [state, setState] = useState(initialState)

  // async function setupEmulators(auth: any) {
  //   const authUrl = 'http://localhost:9099'
  //   await fetch(authUrl)
  //   console.log('done');
  //   connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  //   // why? to make sure that emulator are loaded
  // }

  // re-initialize firebase auth state
  React.useEffect(() => {
    // GoogleSignin.configure();
    // console.log(await GoogleSignin.isSignedIn());
    // setState({ ...initialState, isLoading: false });

    // const auth = getAuth();
    // const auth = initializeAuth(FirebaseUtils.initialize())
    // connectAuthEmulator(auth, "http://localhost:9099");
    // setupEmulators(auth)

    bootstrap();
  }, []);

  async function bootstrap() {
    const app = FirebaseUtils.initialize();
    // GoogleSignin.configure();  // required - initializes the native config
    
    // if(await GoogleSignin.isSignedIn()) {
    //   setState({...initialState, userMessage: 'Trying to re-authenticate with existing credentials.'});

    //   console.log('User already signed in.');

    //   let googleUser = null;
    //   try {
    //     googleUser = await GoogleSignin.getCurrentUser();
    //   } catch(e) {
    //     sendToLoginScreen();
    //     return;
    //   }

    //   if(!googleUser?.idToken) {  // id token expired
    //     sendToLoginScreen();
    //     return;
    //   }
    //   console.log(JSON.stringify(googleUser));
    try {
      const auth = getAuth()

      connectAuthEmulator(auth, "http://192.168.1.78:9099/")
      console.log(getAuth().emulatorConfig);
    } catch(e) {
      console.error(e)
    }

    // return;
      try {
        await FirebaseUtils.setupUser('{"sub": "abc1233", "email": "foo2@example.com", "email_verified": true}');
      } catch(e: any) {
        // TODO: graceful user message
        if(e.code == 'auth/invalid-credential') {
          setState({...initialState, userMessage: 'Session expired, you will need to login again.'});
          await setTimeout
          console.log('ID token is expired.  Sending to sign in page.');
        } else {
          console.error('Firebase login failed..', e);
        }

        // throw new Error('Unable to get the user that is signed in.')
        setTimeout(sendToLoginScreen, 1500) // let error message show then redirect
        return;
      }

      // re-login success
      setState({...initialState, isLoading: false, isSignedIn: true, userInfo: {} });
    // } else {
    //   sendToLoginScreen();
    // }
  }

  function sendToLoginScreen() {
    setState({ ...initialState, isLoading: false, isSignedIn: false });
  }

  async function signIn() {
    let googleUser = null;
    try {
      googleUser = await GoogleSignin.signIn();
    } catch (error: any) {  // code doesn't exist on 
      // console.log(JSON.stringify(e));
      if(error?.code == statusCodes.SIGN_IN_CANCELLED) {
        console.log(error.message);
        setState({ ...initialState, isLoading: false, isSignedIn: false })
        return
      }

      console.log('There was an error signing in.', error.message);
      // throw new Error('Error logging in.  Check logs.');
    }
    
    googleUser = (googleUser == null) ? {} : googleUser;
    await FirebaseUtils.setupUser(googleUser?.idToken);

    setState({ ...initialState, isLoading: false, userInfo: googleUser, isSignedIn: true })
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
  } else if(state.isLoading) {
    landingScreen = <Screen name="Home">
      {(props) => <View style={styles.centered}>
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
          <Text>{ state.userMessage }</Text>
        </View>}
      </Screen>
  } else {
    landingScreen = <Screen name="SignInScreen" component={SignInScreen} />
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Navigator screenOptions={{
          headerRight: () => (
            state.isSignedIn ? <SignOutScreen></SignOutScreen> : null
          )
        }}>
          {landingScreen}
        </Navigator>
      </NavigationContainer>
    </PaperProvider>
  );

}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})