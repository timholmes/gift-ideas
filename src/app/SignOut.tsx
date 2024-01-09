import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Button, View } from "react-native";


export default function SignOut({ signOutListener }: any) {

    function signOut() {
        console.log('signout method');

        GoogleSignin.signOut()
        .then(() => {
            signOutListener(true, null);
        })
        .catch((e) => {
            signOutListener(false, e)
            console.error('Sign out failed.', e);
        });

        signOutListener(true)
    }

    return (
        <>
            <View style={{ paddingEnd: 10 }}>
            <Button title="Sign Out" onPress={signOut}></Button>
            </View>
        </>
    )
}