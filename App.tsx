import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { AppContext } from './src/app/AppContext';
import Home from './src/app/Home';
import { initialContext } from './src/app/Types';
import { SignInEvents } from './src/app/auth/SignIn';
import SignOut, { SignOutEvents } from './src/app/auth/SignOut';
import { AddIdea } from './src/app/ideas/AddIdea';
import MyIdeas from './src/app/ideas/MyIdeas';
import { FirebaseUtils } from './src/app/util/FirebaseUtils';
import { Test1, Test2 } from './spec/auth/StubUsers';
import { Sharing } from './src/app/permissions/Sharing';
import ListConnections from './src/app/connections/ListConnections';

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
      await FirebaseUtils.stubSignIn(Test2);
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

  const HomeStack = createNativeStackNavigator();
  const IdeasStack = createNativeStackNavigator();
  const ConnectionsStack = createNativeStackNavigator();
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

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={Home} options={{
          headerShown: false
        }} />
      </HomeStack.Navigator>
    )
  }

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

  function ConnectionsStackScreens() {
    return (
      <ConnectionsStack.Navigator>
        <ConnectionsStack.Screen name="Connect" component={ListConnections} options={{
          headerShown: false
        }} />
        {/* <ConnectionsStack.Screen name="AddIdea" component={AddIdea} options={{ title: "Idea"}}/> */}
      </ConnectionsStack.Navigator>
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
          component={HomeStackScreen} 
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
        <Tab.Screen 
          name="Connections" 
          initialParams={state.userInfo}
          component={ConnectionsStackScreens}
          options={{
            tabBarLabel: 'Connect',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="handshake-outline" color={color} size={size} />
            )
          }}>
        </Tab.Screen>
      </Tab.Navigator>
    )
  }

  return (
    <PaperProvider>
      <AppContext.Provider value={state}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            {/* <SignInStackScreen/> */}
            <MainTabs />
          </NavigationContainer>
        </GestureHandlerRootView>
      </AppContext.Provider>
    </PaperProvider>
  );
}
