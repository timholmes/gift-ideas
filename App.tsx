import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
// import SignIn from './src/app/SignIn';

const { Navigator, Screen } = createNativeStackNavigator();

type Context = {
  signIn(): void;
  signOut(): void;
}
const AuthContext = React.createContext<Context>({
  signIn: function (): void {
    console.log('initial');
  },
  signOut: function (): void {
  }
});

export default function App({ navigation }: any) {
  
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      console.log(`${new Date()} \n dispatch: ${JSON.stringify(action)} prevState: ${JSON.stringify(prevState)}`);

      switch (action.type) {
        case 'BOOTSTRAP_COMPLETE':
          return {
            ...prevState,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignedIn: true,
            userInfo: action.userInfo
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignedIn: false,
            userInfo: null
          }
      }
    }, {
      isLoading: true,
      isSignedIn: false,
      userInfo: null
    });

  // re-initialize firebase auth state
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      GoogleSignin.configure();
      // const isSignedInReply = await GoogleSignin.isSignedIn()
      // const userInfo = await GoogleSignin.signInSilently()

      //simulate not previously signed-in
      dispatch({ type: 'BOOTSTRAP_COMPLETE', isSignedIn: false, userInfo: null })
    }

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        console.log('click signin');
        dispatch({ type: 'SIGN_IN', userInfo: { email: 'test@test.com' } })
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' })
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
  if(false) {
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
  // // } else {
  //   return (
  //     <NavigationContainer>
  //       <Navigator>
  //         <Screen name="SignIn" component={SignIn} />
  //       </Navigator>
  //     </NavigationContainer>
  //   );
  // }

}