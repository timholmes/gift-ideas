import { DeviceEventEmitter, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Test1, Test2 } from "../../../spec/auth/StubUsers";
import { User } from "../Types";
import { FirebaseUtils } from "../util/FirebaseUtils";
import { homeStyles, siteStyles } from "../shared/ApplicationStyles";
import { SignInEvents } from "./SignIn";


export default function SignInStub() {

    function handleClickUser(user: User) {

        try {
            FirebaseUtils.stubSignIn(user);
        } catch (error: any) {
            if (error.code == 'auth/invalid-credential') {
                // setState({ ...initialState, userMessage: 'Session expired, you will need to login again.' });
                console.log('ID token is expired.  Sending to sign in page.');
                DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: false });
              } else if (error.code == 'auth/network-request-failed') {
                DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: false });
              }
              console.error('Firebase login failed..', error);
              return;
        }

        DeviceEventEmitter.emit(SignInEvents.SIGN_IN_COMPLETE, { success: true, userInfo: user });
    }

    return (
        <View style={siteStyles.container}>
            <Text style={{paddingTop: 10, paddingBottom: 20}}>Select a user below to test with that user.</Text>
            <View style={{paddingBottom: 10}}>
                <Button onPress={() => handleClickUser(Test1)} mode="contained" style={ siteStyles.primaryButton }>Test 1</Button>
            </View>
            <View>
                <Button onPress={() => handleClickUser(Test2)} mode="contained" style={ siteStyles.primaryButton }>Test 1</Button>
            </View>
        </View>
    )
}