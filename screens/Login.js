import { useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import auth from "@react-native-firebase/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const checkEmail = () => {
    return email.includes("@") || email === "";
  };
  const checkPassword = () => {
    let regex = /.{6,}/;
    return regex.test(password) || password === "";
  };

  const handleLogin = () => {
    auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        const emailCopy = email;  // Store email before clearing the field
        setEmail("");  // Clear email
        setPassword("");  // Clear password
        navigation.reset({
          index: 0,
          routes: [{ name: "Home", params: { userEmail: emailCopy } }],
        });
      })
      .catch(error => {
        alert('Error logging in:', error.message);
      });
  };

  const handleForgot = () => {
    if (email) {
      auth().sendPasswordResetEmail(email)
        .then(() => {
          alert('Password reset email sent to your email!');
        })
        .catch(error => {
          alert('Error sending password reset email:', error.message);
        });
    } else {
      alert('Please enter your email address to reset your password.');
    }
  };

  const handleCreate = () => {
    navigation.navigate("Register");
  };

  const isButtonDisabled = () => {
    return !checkEmail() || !checkPassword() || email === "" || password === "";
  };

  return (
    <ImageBackground
      source={require("../images/background.png")}
      style={styles.container}>
      <Image source={require("../images/moon.png")} style={styles.image} />
      <View style={styles.form}>
        <Text style={styles.header}>Sign in with your account</Text>
        <Text style={styles.text}>Email address</Text>
        <TextInput
          placeholder="Enter your email..."
          style={styles.txtInput}
          onChangeText={(text) => (setEmail(text))}
          left={<TextInput.Icon icon={"email"} />}
          value={email} />
        <HelperText type="error" visible={!checkEmail()} style={styles.helpertext}>
          Your email must be in correct format!
        </HelperText>
        <Text style={styles.text}>Password</Text>
        <TextInput
          placeholder="Enter your password..."
          secureTextEntry={!showPass}
          style={styles.txtInput}
          onChangeText={(text) => setPassword(text)}
          left={<TextInput.Icon icon={"key"} />}
          right={
            <TextInput.Icon
              icon={(showPass) ? "eye" : "eye-off"}
              onPress={() => setShowPass(!showPass)} />
          }
          value={password} />
        <HelperText type="error" visible={!checkPassword()} style={styles.helpertext}>
          Your password must have at least 6 characters!
        </HelperText>
        <Button mode="text" style={styles.forgotBtn} onPress={handleForgot}>Forgot your password?</Button>
        <Button
          mode="contained-tonal"
          style={styles.button}
          onPress={handleLogin}
          disabled={isButtonDisabled()}>
          <Text style={styles.txtBtn}>Sign in</Text>
        </Button>
        <Button mode="text" style={styles.createBtn} onPress={handleCreate}>or Create new account</Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "aqua",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  form: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
  },
  header: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#243b54",
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  txtInput: {
    paddingLeft: 10,
    marginTop: 5,
    width: 300,
    height: 40,
  },
  button: {
    alignSelf: "center",
    width: 200,
  },
  txtBtn: {
    fontSize: 20,
    fontWeight: "700",
  },
  forgotBtn: {
    alignSelf: "flex-end",
  },
  createBtn: {
    alignSelf: "center",
  },
  helpertext: {
    margin: -7,
  },
});
