import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter, LogBox } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { FirebaseUtils } from './src/app/util/FirebaseUtils';
import Home from './src/app/Home';
import SignIn, { SignInEvents } from './src/app/auth/SignIn';
import SignOut, { SignOutEvents } from './src/app/auth/SignOut';
import MyIdeas from './src/app/ideas/MyIdeas';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

  LogBox.ignoreAllLogs();
  
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

  function MainTabs() {
    return (
      <Tab.Navigator 
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
        <Tab.Screen 
          name="Home" 
          component={Home} 
          initialParams={state.userInfo}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            )
          }}>
        </Tab.Screen>
        <Tab.Screen 
          name="My Ideas" 
          component={MyIdeas}
          options={{
            tabBarLabel: 'My Ideas',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="lightbulb" color={color} size={size} />
            )
          }}>
        </Tab.Screen>
        <Tab.Screen 
          name="Give" 
          component={MyIdeas}
          options={{
            tabBarLabel: 'Give',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="wallet-giftcard" color={color} size={size} />
            )
          }}>
        </Tab.Screen>
      </Tab.Navigator>
    )
  }

  const Tab = createBottomTabNavigator();
  let landingScreen = null;
  if (state.isSignedIn) {
    landingScreen = <Tab.Screen name="Home" component={Home} initialParams={state.userInfo}></Tab.Screen>
  } else {
    landingScreen = <Screen name="Sign In" component={SignIn} />
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </PaperProvider>
  );
}
