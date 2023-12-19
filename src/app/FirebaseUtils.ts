import { initializeApp, getApps, getApp, FirebaseApp } from '@firebase/app';
import firebaseConfig from '../../firebase-config.json';

export class FirebaseUtils {
  
  static getInstance(): FirebaseApp {
    if (getApps().length == 0) {
      return initializeApp(firebaseConfig.result.sdkConfig);
    } else {
      return getApp(); // if already initialized, use that one
    }
  }

}