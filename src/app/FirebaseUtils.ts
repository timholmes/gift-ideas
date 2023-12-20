import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import firebaseConfig from '../../firebase-config.json';
import { GoogleAuthProvider, getAuth, signInWithCredential, UserCredential } from '@firebase/auth';

export class FirebaseUtils {
  
  static initialize(): FirebaseApp {
    console.log(getApps().length);
    if (getApps().length == 0) {
      return initializeApp(firebaseConfig.result.sdkConfig);
    } else {
      return getApp(); // if already initialized, use that one
    }
  }

  static setupUser(idToken: string | null | undefined): Promise<UserCredential> {
    const provider = GoogleAuthProvider.credential(idToken)
    return signInWithCredential(getAuth(), provider)
  } 

}