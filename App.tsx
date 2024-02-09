import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { UserContext, initialContext } from './src/app/AppContext';
import Home from './src/app/Home';
import SignIn, { SignInEvents } from './src/app/auth/SignIn';
import SignOut, { SignOutEvents } from './src/app/auth/SignOut';
import { AddIdea } from './src/app/ideas/AddIdea';
import MyIdeas from './src/app/ideas/MyIdeas';
import { FirebaseUtils } from './src/app/util/FirebaseUtils';

GoogleSignin.configure();  // required - initializes the native config

export default function App() {
  const [state, setState] = useState(initialContext)

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
      console.log("Environment is 'local'.");
      await FirebaseUtils.stubSignIn();
    }
  }

  async function handleSignIn(eventData: any) {
    console.log(`Signin is complete.  Success? ${eventData.success}`);

    if(eventData.success == false) {
      setState({ ...initialContext, isLoading: false, isSignedIn: false })
    } else {
      setState({ ...initialContext, isLoading: false, userInfo: eventData.userInfo, isSignedIn: true })
    }
  }

  function handleSignOut(eventData: any) {
    if(eventData.success && !eventData.error) {
      setState({ ...initialContext,isSignedIn: false, isLoading: false });
    } else {
      setState({ ...initialContext, isSignedIn: false, isLoading: false, userMessage: 'Sign-out failed.' });
    }
    return;
  }

  const IdeasStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  // const SignInStack = createNativeStackNavigator();

  // const navigation = useNavigation();


  // function SignInStackScreen() {
  //   return (
  //     <SignInStack.Navigator>
  //       <SignInStack.Screen name="SignIn" component={SignIn} />
  //     </SignInStack.Navigator>
  //   )
  // }

  function IdeasStackScreen() {
    return (
      <IdeasStack.Navigator>
        <IdeasStack.Screen name="MyIdeas" component={MyIdeas} options={{
          headerShown: false
        }} />
        <IdeasStack.Screen name="AddIdea" component={AddIdea} options={{ title: "Idea"}}/>
      </IdeasStack.Navigator>
    )
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
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            )
          }}>
        </Tab.Screen>
        <Tab.Screen 
          name="My Ideas" 
          initialParams={state.userInfo}
          component={IdeasStackScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'My Ideas',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="lightbulb" color={color} size={size} />
            )
          }}>
        </Tab.Screen>
        <Tab.Screen 
          name="Give" 
          initialParams={state.userInfo}
          component={Home}
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

  return (
    <PaperProvider>
      <UserContext.Provider value={state}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            {/* <SignInStackScreen/> */}
            <MainTabs />
          </NavigationContainer>
        </GestureHandlerRootView>
      </UserContext.Provider>
    </PaperProvider>
  );
}
