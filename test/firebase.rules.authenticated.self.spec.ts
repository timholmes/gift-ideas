import { RulesTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { beforeAll, beforeEach, describe, test } from '@jest/globals';
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { resolve } from 'node:path';
import { expectFirestorePermissionDenied, expectPermissionGetSucceeds, setupFirestore } from './utils';

let testEnv: RulesTestEnvironment;
const PROJECT_ID = 'gift-ideas-b1988';
const FIREBASE_JSON = resolve(__dirname, '../firebase.json');

const MY_EMAIL = 'me@email.com';
const USER_SHARING_WITH_ME_EMAIL = 'aaa';
const USER_IM_NOT_SHARING_WITH = 'user-im-not-sharing-with@email.com';

beforeAll(async () => {
    testEnv = await setupFirestore();
    await testEnv.withSecurityRulesDisabled(async (context) => {
        let dbContext = context.firestore()
        await addDoc(collection(dbContext, 'users', MY_EMAIL, 'ideas'), {
            title: 'idea1',
            description: 'desc1'
        });

        await addDoc(collection(dbContext, 'users', USER_SHARING_WITH_ME_EMAIL, 'ideas'), {
            title: 'idea3',
            description: 'desc3'
        });

        await setDoc(doc(dbContext, "users", USER_SHARING_WITH_ME_EMAIL), { canView: [MY_EMAIL]})
    });
});


beforeEach(async () => {
    await testEnv.clearFirestore();
});

describe("authenticated user security permissions", () => {
    test("I can read my collection of ideas", async function () {
        const db = testEnv.authenticatedContext(MY_EMAIL, {email: MY_EMAIL}).firestore();
    
        await assertSucceeds(getDocs(collection(db, "users", MY_EMAIL, "ideas")));
    });

    test("others cannot read my data without sharing", async function () {
        const db = testEnv.authenticatedContext(USER_IM_NOT_SHARING_WITH, {email: USER_IM_NOT_SHARING_WITH}).firestore();
        
        // not sure why I can't use util package, but when using it I get a false positive
        const result = await assertFails(getDocs(collection(db, "users", MY_EMAIL, "ideas")))
        expect(result.code).toBe('permission-denied' || 'PERMISSION_DENIED');
    });

    test("I can read others shared data", async function () {
        const db = testEnv.authenticatedContext(MY_EMAIL, {email: MY_EMAIL}).firestore();

        await assertSucceeds(getDocs(collection(db, "users", USER_SHARING_WITH_ME_EMAIL, "ideas")));

        expect(true).toBe(true);
    });    
});
