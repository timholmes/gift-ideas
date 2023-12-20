import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
// import SignIn from './src/app/SignIn';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@firebase/auth';
import { FirebaseUtils } from './src/app/FirebaseUtils';

const { Navigator, Screen } = createNativeStackNavigator();
const initialState = {
  isLoading: true,
  isSignedIn: false,
  userInfo: {}
}

export default function App({ navigation }: any) {
  const [state, setState] = useState(initialState)

  // re-initialize firebase auth state
  React.useEffect(() => {
    // GoogleSignin.configure();
    // console.log(await GoogleSignin.isSignedIn());
    // setState({ ...initialState, isLoading: false });

    bootstrap();
  }, []);

  async function bootstrap() {
    FirebaseUtils.initialize();
    GoogleSignin.configure();  // required - initializes the native config
    
    if(await GoogleSignin.isSignedIn()) {
      console.log('User already signed in.');

      let googleUser = null;
      try {
        googleUser = await GoogleSignin.getCurrentUser();
      } catch(e) {
        sendToLoginScreen();
        return;
      }

      if(!googleUser?.idToken) {  // id token expired
        sendToLoginScreen();
        return;
      }
      try {
        await FirebaseUtils.setupUser(googleUser?.idToken);
      } catch(e) {
        // TODO: graceful user message
        console.error('Unable to setup the user that is signed in.', e);
        // throw new Error('Unable to get the user that is signed in.')
        setState({ ...initialState, isLoading: false });
        return;
      }

      setState({...initialState, isLoading: false, isSignedIn: true, userInfo: googleUser })
    } else {
      setState({ ...initialState, isLoading: false });
    }
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