import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Home from './src/app/Home';
import SignIn from './src/app/SignIn';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
const firebaseConfig = require('./firebase-config.json').result.sdkConfig;


const { Navigator, Screen } = createNativeStackNavigator();

export default function App({ navigation }: any) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    // const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
    //   setIsSignedIn(!!user);
    // });
    // return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    GoogleSignin.configure();


    const handleSignIn = async () => {
      const signedInReply = await GoogleSignin.isSignedIn()
      setIsSignedIn(signedInReply)

      const userInfo: User | null = await GoogleSignin.signInSilently()
      // userInfo = await GoogleSignin.getCurrentUser();
      setUserInfo(userInfo)
      // console.log(userInfo);
    }

    handleSignIn();

  }, []);
  
  if(isSignedIn) {
    return (
      <PaperProvider>
        <NavigationContainer>
            <Navigator screenOptions={{ 
                headerRight: () => (
                  <View style={{ paddingEnd: 10 }}>
                    <Button title="Sign Out" onPress={ () => {
                      // firebase.auth().signOut();
                    }} ></Button>
                  </View>
                )
              }}>
              <Screen name="Home" component={Home} />
          </Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  } else {
    return (
      <NavigationContainer>
        <Navigator>
          <Screen name="SignIn" component={SignIn}/>
        </Navigator>
      </NavigationContainer>
    );
  }
  
}