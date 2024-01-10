import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Button } from "react-native";
import { Text } from "react-native-paper";


export default function SignIn( { onSignInListener }: any) {

    async function signIn() {
        async function signIn() {
            let googleUser = null;
            try {
              googleUser = await GoogleSignin.signIn();
            } catch (error: any) {  // code doesn't exist on 
              if (error?.code == statusCodes.SIGN_IN_CANCELLED) {
                console.log(error.message);
                // setState({ ...initialState, isLoading: false, isSignedIn: false })
                return
              }
        
              console.log('There was an error signing in.', error.message);
            }
        
            googleUser = (googleUser == null) ? {} : googleUser;
            // await FirebaseUtils.setupUser(googleUser?.idToken);
        
            // setState({ ...initialState, isLoading: false, userInfo: googleUser, isSignedIn: true })
          }

    }

    return (
        <>
          <Button title="Sign In" onPress={signIn}></Button>
        </>
      )
}