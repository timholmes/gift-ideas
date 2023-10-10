import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { Component, useEffect, useState } from "react";
import { Text, View } from "react-native";

function Home() {
  const [userInfo, setUser] = useState<User | null>(null);

  useEffect(() => {
    GoogleSignin.configure();
    const handleSignIn = async () => {
      const signedInReply = await GoogleSignin.isSignedIn()

      let userInfo: User | null;
      // userInfo = await GoogleSignin.signInSilently()
      userInfo = await GoogleSignin.getCurrentUser();
      setUser(userInfo)
    }

    handleSignIn();

  }, []);

  return (
    <View>
      <Text>
        Welcome, { userInfo?.user.name }.
      </Text>

    </View>
  )
}

export default Home;