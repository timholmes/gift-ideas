import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Button, DeviceEventEmitter } from "react-native";
import { FirebaseUtils } from "./FirebaseUtils";
import LoadingOverlay from "./LoadingOverlay";
import { useEffect, useState } from "react";

export enum SignInEvents {
  SIGN_IN_COMPLETE = "event.onSignIn"
}

const initialState = {
  attemptingReSignin: false,
  reSignInSuccess: false
}

export declare interface User {
  firstName: string | null | undefined,
  email: string | undefined
}



export default function SignIn() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    console.log('attempt');
    attemptReSignIn();
  }, [])

  async function attemptReSignIn() {
    setState({ ...initialState, attemptingReSignin: true });

    if (await GoogleSignin.isSignedIn()) {
      console.log('Google - attempting re-signin.');

      let googleUser = null;
      try {
        googleUser = await GoogleSignin.getCurrentUser();
      } catch (e) {
        setState({ ...initialState, attemptingReSignin: false, reSignInSuccess: false });
        return;
      }

      if (!googleUser?.idToken) {  // id token expired
        setState({ ...initialState, attemptingReSignin: false, reSignInSuccess: false });
        return;
      }
      
      setState({ ...initialState, attemptingReSignin: true, reSignInSuccess: true });

      let user: User = {
        firstName: googleUser.user.givenName,
        email: googleUser.user.email
      }
      
      DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: true, error: null, userInfo: user });
    }

    setState({ ...initialState, attemptingReSignin: false });
  }

  async function signIn() {

    let googleUser = null;
    try {
      googleUser = await GoogleSignin.signIn();
    } catch (error: any) {  // code doesn't exist on 
      if (error?.code == statusCodes.SIGN_IN_CANCELLED) {
        console.log(error.message);

        DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: false, error: error });
        // setState({ ...initialState, isLoading: false, isSignedIn: false })
        return;
      }
      
      console.log('There was an error signing in.', error.message);
      DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: false, error: error});
    }

    googleUser = (googleUser == null) ? {} : googleUser;
    await FirebaseUtils.setupUser(googleUser?.idToken);

    let user: User = {
      firstName: googleUser.user?.givenName,
      email: googleUser.user?.email
    }
    // setState({ ...initialState, isLoading: false, userInfo: googleUser, isSignedIn: true })
    DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: true, userInfo: user});

  }


  let landingPage = null;
  if(state.attemptingReSignin) {
    landingPage = <LoadingOverlay></LoadingOverlay>
  } else {
    landingPage = <Button title="Sign In" onPress={signIn}></Button>
  }

  return (
    <>
      { landingPage }
    </>
  )
}