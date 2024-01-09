import { Button, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FirebaseUtils } from './src/app/FirebaseUtils';
import { getAuth, connectAuthEmulator, UserCredential, User, Auth } from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { ActivityIndicator, MD2Colors, PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
import SignOut from './src/app/SignOut';

const { Navigator, Screen } = createNativeStackNavigator();
GoogleSignin.configure();  // required - initializes the native config

const initialState = {
  isLoading: true,
  isSignedIn: false,
  userInfo: {},
  userMessage: ''
}


export default function App() {
  const [state, setState] = useState(initialState)
  
  async function setupEmulators() {
    const app = FirebaseUtils.initialize();
    let auth = getAuth()

    // on hot reload - don't initialize if already initialized
    if(!auth.emulatorConfig) {
      const authUrl = 'http://localhost:9099'
      await fetch(authUrl)
      console.log('done');

      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      } catch(e: any) {
        console.error(e);
      }
    }
    // why? to make sure that emulator are loaded
  }


  async function bootstrap() {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT == 'LOCAL') {
      await setupEmulators();
      await stubSignIn();
    } else {
      await attemptReSignIn();
    }
  }

  // re-initialize firebase auth state
  useEffect(() => {
    bootstrap();
  }, []);

  async function stubSignIn() {
    console.log('stubbing sign in');

    let userCredential: UserCredential;
    try {
      userCredential = await FirebaseUtils.setupUser('{"sub": "abc1233", "email": "test1@test.com", "email_verified": true }');
    } catch (e: any) {
      // TODO: graceful user message
      if (e.code == 'auth/invalid-credential') {
        setState({ ...initialState, userMessage: 'Session expired, you will need to login again.' });
        console.log('ID token is expired.  Sending to sign in page.');
      } else if (e.code == 'auth/network-request-failed') {
        setState({ ...initialState, userMessage: 'Error - Emulator not connected.' });
      }
      console.error('Firebase login failed..', e);

      setTimeout(sendToLoginScreen, 1500) // let error message show then redirect
      return;
    }

    setState({ ...initialState, isLoading: false, userInfo: userCredential.user, isSignedIn: true })
  }

  async function attemptReSignIn() {
    if (await GoogleSignin.isSignedIn()) {
      setState({ ...initialState, userMessage: 'Trying to re-authenticate with existing credentials.' });
      console.log('User already signed in.');

      let googleUser = null;
      try {
        googleUser = await GoogleSignin.getCurrentUser();
      } catch (e) {
        sendToLoginScreen();
        return;
      }

      if (!googleUser?.idToken) {  // id token expired
        sendToLoginScreen();
        return;
      }
    }

    showDoneLoading();
  }

  function showDoneLoading() {
    setState({ ...initialState, isLoading: false });
  }

  function sendToLoginScreen() {
    setState({ ...initialState, isLoading: false, isSignedIn: false });
  }

  async function signIn() {
    let googleUser = null;
    try {
      googleUser = await GoogleSignin.signIn();
    } catch (error: any) {  // code doesn't exist on 
      if (error?.code == statusCodes.SIGN_IN_CANCELLED) {
        console.log(error.message);
        setState({ ...initialState, isLoading: false, isSignedIn: false })
        return
      }

      console.log('There was an error signing in.', error.message);
    }

    googleUser = (googleUser == null) ? {} : googleUser;
    await FirebaseUtils.setupUser(googleUser?.idToken);

    setState({ ...initialState, isLoading: false, userInfo: googleUser, isSignedIn: true })
  }

  function SignInScreen(props: any) {
    return (
      <>
        <Text>{JSON.stringify(state)}</Text>
        <Button title="Sign In" onPress={signIn}></Button>
      </>
    )
  }

  let landingScreen = null;
  if (state.isSignedIn) {

    landingScreen = <Screen name="Home">
      {(props) => <Home {...props} userInfo={state.userInfo} />}
    </Screen>

  } else if (state.isLoading) {
    landingScreen = <Screen name="Home">

      {(props) =>
        <View style={styles.centered}>
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
          <Text>{state.userMessage}</Text>
        </View>
      }

    </Screen>
  } else {
    landingScreen = <Screen name="SignInScreen" component={SignInScreen} />
  }

  function handleSignOut(success: boolean, error: Error) {
    console.log('handling sign out ' + success);
    
    if(success && !error) {
      setState({ ...initialState, userInfo: {}, isSignedIn: false, isLoading: false });
    } else {
      setState({ ...initialState, userInfo: {}, isSignedIn: false, isLoading: false, userMessage: 'Sign-out failed.' });
    }
    return;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Navigator screenOptions={{
          headerRight: () => (
            state.isSignedIn ? <SignOut signOutListener={handleSignOut}></SignOut> : null
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
});
