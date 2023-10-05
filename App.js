import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
const firebaseConfig = require('./firebase-config.json').result.sdkConfig;
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import firebase from 'firebase/compat/app';


export default function App() {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  // const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);

  GoogleSignin.configure();

  // Somewhere in your code
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!!</Text>
      <Pressable onPress={signIn}><Text>Login</Text></Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
