import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
import LoadingOverlay from './src/app/LoadingOverlay';
import SignIn, { SignInEvents } from './src/app/SignIn';
import SignOut, { SignOutEvents } from './src/app/SignOut';
import { FirebaseUtils } from './src/app/FirebaseUtils';

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

  // re-initialize firebase auth state
  useEffect(() => {
    setupEnvironment();
    DeviceEventEmitter.addListener(SignOutEvents.SIGN_OUT_COMPLETE, (eventData) => { handleSignOut(eventData) })
    DeviceEventEmitter.addListener(SignInEvents.SIGN_IN_COMPLETE, (eventData) => { handleSignIn(eventData) })
    
    return () => {
      DeviceEventEmitter.removeAllListeners();
    };

  }, []);

  async function setupEnvironment() {
    if (FirebaseUtils.isLocal()) {
      await FirebaseUtils.stubSignIn();
    }
  }

  async function handleSignIn(eventData: any) {
    if(eventData.success == false) {
      setState({ ...initialState, isLoading: false, isSignedIn: false })
    } else {
      setState({ ...initialState, isLoading: false, userInfo: eventData.userInfo, isSignedIn: true })
    }
  }

  function handleSignOut(eventData: any) {
    if(eventData.success && !eventData.error) {
      setState({ ...initialState, userInfo: {}, isSignedIn: false, isLoading: false });
    } else {
      setState({ ...initialState, userInfo: {}, isSignedIn: false, isLoading: false, userMessage: 'Sign-out failed.' });
    }
    return;
  }


  let landingScreen = null;
  if (state.isSignedIn) {
    landingScreen = <Screen name="Home">
      { (props) => <Home {...props} userInfo={state.userInfo} /> }
    </Screen>
  } else {
    landingScreen = <Screen name="Sign In" component={SignIn} />
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
