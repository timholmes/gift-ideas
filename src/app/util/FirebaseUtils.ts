import { GoogleAuthProvider, UserCredential, getAuth, signInWithCredential } from '@firebase/auth';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator } from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { DeviceEventEmitter } from 'react-native';
import firebaseConfig from '../../../firebase-config.json';
import { SignInEvents } from '../auth/SignIn';
import { Test1 } from '../../../test/auth/StubUsers';
import { User } from '../Types';

// TODO: we are mixing class and function constructs.  Need to refactor.
export class FirebaseUtils {

  static databaseInitialized = false;
  
  static initialize(): FirebaseApp {
    if (getApps().length == 0) {
      return initializeApp(firebaseConfig.result.sdkConfig);
    } else {
      return getApp(); // if already initialized, use that one
    }
  }

  static getFirestoreDatabase(): Firestore {
    const firebaseApp = FirebaseUtils.initialize();
    const db = getFirestore(firebaseApp);
    
    if (!this.databaseInitialized && FirebaseUtils.isLocal()) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    this.databaseInitialized = true;
    return db;
  }
  
  private static async setupAuthEmulator() {
    const app = FirebaseUtils.initialize();
    let auth = getAuth()

    // on hot reload - don't initialize if already initialized
    if (!auth.emulatorConfig) {
      const authUrl = 'http://localhost:9099'
      await fetch(authUrl)

      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      } catch (e: any) {
        console.error(e);
      }
    }
    // why? to make sure that emulator are loaded
  }

  static isLocal(): boolean {
    return (process.env.EXPO_PUBLIC_ENVIRONMENT == 'LOCAL') ? true : false
  }

  static async stubSignIn(user: User) {
    console.log('stubbing sign in');

    let userCredential: UserCredential;
    try {
      userCredential = await FirebaseUtils.setupUser(JSON.stringify(user)); // emulator takes a plain json string
    } catch (e: any) {
      // TODO: graceful user message
      if (e.code == 'auth/invalid-credential') {
        // setState({ ...initialState, userMessage: 'Session expired, you will need to login again.' });
        console.log('ID token is expired.  Sending to sign in page.');
        DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: false });
      } else if (e.code == 'auth/network-request-failed') {
        DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: false });
      }
      console.error('Firebase login failed..', e);
      return;
    }
    
    DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: true, userInfo: user });
  }

  static async setupUser(idToken: string | null | undefined): Promise<UserCredential> {

    if(FirebaseUtils.isLocal()) {
      await FirebaseUtils.setupAuthEmulator();
    }

    const provider = GoogleAuthProvider.credential(idToken)
    return signInWithCredential(getAuth(), provider)
  }

}
