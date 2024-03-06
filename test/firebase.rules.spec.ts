import { describe, test, beforeEach, beforeAll, afterAll, expect } from '@jest/globals';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { expectDatabasePermissionDenied, expectFirestorePermissionDenied, expectFirestorePermissionUpdateSucceeds, expectPermissionGetSucceeds, getFirestoreCoverageMeta } from './utils';
import { readFileSync, createWriteStream } from "node:fs";
import { get } from "node:http";
import { resolve } from 'node:path';
import { doc, getDoc, setDoc, serverTimestamp, setLogLevel, collection, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Idea } from '../src/app/Types';

let testEnv: RulesTestEnvironment;
const PROJECT_ID = 'fakeproject2';
const FIREBASE_JSON = resolve(__dirname, '../firebase.json');


beforeAll(async () => {
    // Silence expected rules rejections from Firestore SDK. Unexpected rejections
    // will still bubble up and will be thrown as an error (failing the tests).
    setLogLevel('error');
    const { host, port } = getFirestoreCoverageMeta(PROJECT_ID, FIREBASE_JSON);
    testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
            host,
            port,
            rules: readFileSync('firestore.rules', 'utf8')
        },
    });
});

beforeEach(async () => {
    await testEnv.clearFirestore();
});

describe("logged in user access", () => {
    test('should not be able to read anything without logging in', async function () {

        // Setup: Create documents in DB for testing (bypassing Security Rules).
        await testEnv.withSecurityRulesDisabled(async (context) => {
            await addDoc(collection(context.firestore(), 'users', 'test1@email.com', 'ideas'), {
                title: 'idea1',
                description: 'desc1'
            });
        });

        await testEnv.withSecurityRulesDisabled(async (context) => {
            await addDoc(collection(context.firestore(), "users", "test1@email.com", "sharing"), { 
                view: ['test2@email.com'] 
            });
        });

        const unauthedDb = testEnv.unauthenticatedContext().firestore();

        // try to access
        await expectFirestorePermissionDenied(getDoc(doc(unauthedDb, 'users/test1')));
        await expectFirestorePermissionDenied(getDoc(doc(unauthedDb, 'users/test1/ideas/title')));
        await expectFirestorePermissionDenied(getDoc(doc(unauthedDb, 'users/test1/sharing/view')));

    });
});