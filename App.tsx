import { Button, DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FirebaseUtils } from './src/app/FirebaseUtils';
import { getAuth, connectAuthEmulator, UserCredential, User, Auth } from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { ActivityIndicator, MD2Colors, PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
import SignOut, { SignOutEvents } from './src/app/SignOut';
import LoadingOverlay from './src/app/LoadingOverlay';
import SignIn, { SignInEvents } from './src/app/SignIn';

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
  
  // async function setupEmulators() {
  //   const app = FirebaseUtils.initialize();
  //   let auth = getAuth()

  //   // on hot reload - don't initialize if already initialized
  //   if(!auth.emulatorConfig) {
  //     const authUrl = 'http://localhost:9099'
  //     await fetch(authUrl)
  //     console.log('done');

  //     try {
  //       connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  //     } catch(e: any) {
  //       console.error(e);

  //     }
  //   }
  //   // why? to make sure that emulator are loaded
  // }


  async function bootstrap() {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT == 'LOCAL') {
      // await setupEmulators();
      sendToLoginScreen()
      // await stubSignIn();
    } else {
      // await attemptReSignIn();
    }
  }

  // re-initialize firebase auth state
  useEffect(() => {
    bootstrap();
    DeviceEventEmitter.addListener(SignOutEvents.SIGN_OUT_COMPLETE, (eventData) => { handleSignOut(eventData) })
    DeviceEventEmitter.addListener(SignInEvents.SIGN_IN_COMPLETE, (eventData) => { handleSignIn(eventData) })
    
    return () => {
      DeviceEventEmitter.removeAllListeners();
    };

  }, []);

  // async function stubSignIn() {
  //   console.log('stubbing sign in');

  //   let userCredential: UserCredential;
  //   try {
  //     userCredential = await FirebaseUtils.setupUser('{"sub": "abc1233", "email": "test1@test.com", "email_verified": true }');
  //   } catch (e: any) {
  //     // TODO: graceful user message
  //     if (e.code == 'auth/invalid-credential') {
  //       setState({ ...initialState, userMessage: 'Session expired, you will need to login again.' });
  //       console.log('ID token is expired.  Sending to sign in page.');
  //     } else if (e.code == 'auth/network-request-failed') {
  //       setState({ ...initialState, userMessage: 'Error - Emulator not connected.' });
  //     }
  //     console.error('Firebase login failed..', e);

  //     setTimeout(sendToLoginScreen, 1500) // let error message show then redirect
  //     return;
  //   }

  //   setState({ ...initialState, isLoading: false, userInfo: userCredential.user, isSignedIn: true })
  // }

  function showDoneLoading() {
    setState({ ...initialState, isLoading: false });
  }

  function sendToLoginScreen() {
    setState({ ...initialState, isLoading: false, isSignedIn: false });
  }

  async function handleSignIn(eventData: any) {

    if(eventData.success == false) {
      setState({ ...initialState, isLoading: false, isSignedIn: false })
    } else {
      setState({ ...initialState, isLoading: false, userInfo: eventData.userInfo, isSignedIn: true })
    }
  }

  let landingScreen = null;
  if (state.isSignedIn) {
    landingScreen = <Screen name="Home">
      { (props) => <Home {...props} userInfo={state.userInfo} /> }
    </Screen>
  } else if (state.isLoading) {
    landingScreen = <Screen name="Home">
      {(props) =>
        <LoadingOverlay {...props} />
      }
    </Screen>
  } else {
    landingScreen = <Screen name="Sign In" component={SignIn} />
  }

  function handleSignOut(eventData: any) {
    if(eventData.success && !eventData.error) {
      setState({ ...initialState, userInfo: {}, isSignedIn: false, isLoading: false });
    } else {
      setState({ ...initialState, userInfo: {}, isSignedIn: false, isLoading: false, userMessage: 'Sign-out failed.' });
    }
    return;
  }


  return (
    <PaperProvider>
      <NavigationContainer>
        <Navigator 
          screenOptions={{
            headerRight: () => (
              state.isSignedIn ? <SignOut></SignOut> : null
            )
          }}
          screenListeners={{
            state: (e) => {
              // Do something with the state
              // console.log('state changed', e.data);
            },
          }}
        >
          {landingScreen}
        </Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
