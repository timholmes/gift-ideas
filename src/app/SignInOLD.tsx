import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from "react";
import { Text, View } from "react-native";

function SignInzz() {

  //  const { signIn } = React.useContext(AuthContext)

  // const firebaseApp = firebase.initializeApp(firebaseConfig);
  // ** does this work with native google sign in?
  // const auth = getAuth(firebaseApp);
  // connectAuthEmulator(auth, "http://127.0.0.1:9099");

  GoogleSignin.configure();
  
  // console.log(GoogleSignin.isSignedIn().then((val) => {
  //   console.log(val);
  // }));

  // const signIn = async () => {
  //   try {
  //     // console.log('has play');
  //     // await GoogleSignin.hasPlayServices();
  //     console.log('doing sign in');

  //     const firebaseUser = await GoogleSignin.signIn();
  //     console.log('got user');
  //     console.log(firebaseUser);
  //     setUserInfo(firebaseUser);

  //     console.log('getting user info out of state: ');
  //     console.log(userInfo);

  //   } catch (error: any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //       console.log('sign in cancelled');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //       console.log('sign in in progress');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //       console.log('play services unavailable');
  //     } else {
  //       // some other error happened
  //       console.log('unexpected error');
  //     }
  //   }
  //   console.log('No errors with login.');
  // };

  return (
    <View>
      <Text>
      {/* <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={ signIn }
        disabled={false}
      /> */}
      </Text>
    </View>
  )
}

export default SignInzz;