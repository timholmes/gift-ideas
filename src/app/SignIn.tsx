import { Text, View } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin'

function SignIn() {

   // const [userInfo, setUserInfo] = useState<User>();
  // const firebaseApp = firebase.initializeApp(firebaseConfig);
  // ** does this work with native google sign in?
  // const auth = getAuth(firebaseApp);
  // connectAuthEmulator(auth, "http://127.0.0.1:9099");

  GoogleSignin.configure();
  
  console.log(GoogleSignin.isSignedIn().then((val) => {
    console.log(val);
  }));

  // const signIn = async () => {
  //   try {
  //     console.log('has play');
  //     await GoogleSignin.hasPlayServices();
  //     console.log('sign in');
  //     const firebaseUser: User = await GoogleSignin.signIn();
  //     console.log('firebase user');
  //     console.log(firebaseUser);
  //     setUserInfo(firebaseUser);
  //     console.log(userInfo);
  //     // console.log(state);
  //   } catch (error: any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // };

  return (
    <View>
      <Text>
        Sign In
      </Text>

    </View>
  )
}

export default SignIn;