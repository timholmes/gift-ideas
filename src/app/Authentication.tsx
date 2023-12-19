import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential, getAuth } from '@firebase/auth';
import React, { useReducer, useState } from "react";

export enum AuthenticationEvents {
  BOOTSTRAP_COMPLETE,
  SIGN_IN,
  SIGN_OUT
}

export const initialState = {
    isLoading: true,
    isSignedIn: false,
    userInfo: {}
}


// function authenticationReducer(prevState: any, action: any) {
//     switch (action.type) {
//         case AuthenticationEvents.BOOTSTRAP_COMPLETE:
//             return {
//                 ...prevState,
//                 isLoading: false,
//             };
//         case AuthenticationEvents.SIGN_IN:
//             console.log('do some sign in logic');

//             return {
//                 ...prevState,
//                 isSignedIn: true,
//                 userInfo: action.userInfo
//             }
//         case AuthenticationEvents.SIGN_OUT:
//             return {
//                 ...prevState,
//                 isSignedIn: false,
//                 userInfo: null
//             }
//     }
// }

// export const [state, dispatch]  = useReducer(authenticationReducer, initialState)

// const [state, setState] = useState(initialState)

// export function currentUser() {
//     return state;
// }

// export const currentUser = state;

// export function authenticationMemo(dispatch: any) {
//     () => ({
//         signIn: async () => {
//           console.log('click signin');
  
//           let googleUser = null;
//           try {
//             googleUser = await GoogleSignin.signIn();
//           } catch (error) {
//             console.log(error);
//             throw new Error('Error logging in.  Check logs.')
//           }
  
//           // console.log(JSON.stringify(googleUser.idToken));
  
//           const provider = GoogleAuthProvider.credential(googleUser.idToken)
//           signInWithCredential(getAuth(), provider)
  
//           dispatch({ type: AuthenticationEvents.SIGN_IN, userInfo: googleUser })
//         },
//         signOut: () => dispatch({ type: AuthenticationEvents.SIGN_OUT })
//       })
// }