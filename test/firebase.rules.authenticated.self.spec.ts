import { RulesTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { beforeAll, beforeEach, describe, test } from '@jest/globals';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { resolve } from 'node:path';
import { expectFirestorePermissionDenied, expectPermissionGetSucceeds, setupFirestore } from './utils';

let testEnv: RulesTestEnvironment;
const PROJECT_ID = 'fakeproject2';
const FIREBASE_JSON = resolve(__dirname, '../firebase.json');


beforeAll(async () => {
    testEnv = await setupFirestore();
    await testEnv.withSecurityRulesDisabled(async (context) => {
        await addDoc(collection(context.firestore(), 'users', 'test1@email.com', 'ideas'), {
            title: 'idea1',
            description: 'desc1'
        });
    });
    await testEnv.withSecurityRulesDisabled(async (context) => {
        await addDoc(collection(context.firestore(), 'users', 'test2@email.com', 'ideas'), {
            title: 'idea2',
            description: 'desc2'
        });
    });

    // await testEnv.withSecurityRulesDisabled(async (context) => {
    //     await addDoc(collection(context.firestore(), "users", "test1@email.com", "sharing"), { 
    //         view: ['test2@email.com'] 
    //     });
    // });
});

beforeEach(async () => {
    await testEnv.clearFirestore();
});

describe("authenticated user", () => {
    test('should read all my data', async function () {
        const db = testEnv.authenticatedContext("test1@email.com", {email: "test1@email.com"}).firestore();
        
        await assertSucceeds(getDoc(doc(db, "users/test1@email.com/ideas/title")));
    });

    test('others cannot read my data without sharing', async function () {
        const db = testEnv.authenticatedContext("test1@email.com", {email: "test1@email.com"}).firestore();
        
        // not sure why I can't use util package, but when using it I get a false positive
        const result = await assertFails(getDoc(doc(db, "users/test2@email.com/ideas/title")))
        expect(result.code).toBe('permission-denied' || 'PERMISSION_DENIED');

    });

});