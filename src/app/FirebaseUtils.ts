import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import firebaseConfig from '../../firebase-config.json';
import { GoogleAuthProvider, getAuth, signInWithCredential, UserCredential } from '@firebase/auth';
import { Auth } from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

export class FirebaseUtils {
  
  static initialize(): FirebaseApp {
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

  static getFirestoreDatbase(): Firestore {
    const firebaseApp = FirebaseUtils.initialize();
    const db = getFirestore(firebaseApp);

    if (process.env.EXPO_PUBLIC_ENVIRONMENT == 'LOCAL') {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }

    return db;
  }
}