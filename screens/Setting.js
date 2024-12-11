import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import auth from "@react-native-firebase/auth";

export default function Setting({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth().currentUser;
    console.log("Current User:", currentUser);
    if (currentUser) {
      setUser(currentUser);
    } else {
      console.log("No current user found!");
    }
  }, []);

  const handleLogout = () => {
    auth().signOut().then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
