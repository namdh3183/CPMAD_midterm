import { useState } from "react"
import { Image, ImageBackground, StyleSheet, View } from "react-native"
import { Button, HelperText, Text, TextInput } from "react-native-paper"
import auth from "@react-native-firebase/auth"

export default function Register({navigation}) {
    const [email, setEmail] = useState("")
    const [fullname, setFullname] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const checkEmail = () => {
        return email.includes("@") || email === ""
    }

    const checkPassword = ()=>{
        let regex = /.{6,}/
        return regex.test(password) || password === ""
    }

    const checkConfirmPassword = ()=>{
        return password === confirmPassword || confirmPassword === ""
    }

    const handleGobackLogin = () => {
        navigation.navigate("Login")
    }

    const handleRegister = () => {
        auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          navigation.navigate("Login");
        })
        .catch(error => {
          console.error(error);
        });
    }

    const isButtonDisabled = () => {
        return !checkEmail() || !checkPassword() || email === "" 
                || password === "" || fullname === ""
    }

    return (
        <ImageBackground
        source={require("../images/background.png")}
        style={styles.container}>
            <Image source={require("../images/moon.png")} style={ styles.image }/>

            <View style={ styles.form }>
            <Text style={styles.header}>Sign up new account</Text>

            <Text style={styles.text}>Email address</Text>
            <TextInput 
                placeholder="Enter your email..."
                style={styles.txtInput}
                onChangeText={(text) => (setEmail(text))}
                left={<TextInput.Icon icon={"email"}/>}
                value={email}/>
            <HelperText type="error" visible={!checkEmail()} style={styles.helpertext}>
                Your email must be in correct format !
            </HelperText>

            <Text style={styles.text}>Full name</Text>
            <TextInput 
                placeholder="Enter your full name..."
                style={[{...styles.txtInput, marginBottom: 10}]}
                onChangeText={(text) => (setFullname(text))}
                left={<TextInput.Icon icon={"rename-box"}/>}
                value={fullname}/>
            
            <Text style={styles.text}>Password</Text>
            <TextInput 
                placeholder="Enter your password..."
                secureTextEntry={!showPass}
                style={styles.txtInput}
                onChangeText={(text) => setPassword(text)}
                left={<TextInput.Icon icon={"key"}/>}
                right={
                <TextInput.Icon 
                    icon={(showPass)?"eye":"eye-off"} 
                    onPress={() => setShowPass(!showPass)} />
                }
                value={password}/>
            <HelperText type="error" visible={!checkPassword()} style={styles.helpertext}>
                Your password must have at least 6 characters !
            </HelperText>

            <Text style={styles.text}>Confirm Password</Text>
            <TextInput 
                placeholder="Confirm your password..."
                secureTextEntry={!showConfirmPass}
                style={styles.txtInput}
                onChangeText={(text) => setConfirmPassword(text)}
                left={<TextInput.Icon icon={"key"}/>}
                right={
                <TextInput.Icon 
                    icon={(showConfirmPass)?"eye":"eye-off"} 
                    onPress={() => setShowConfirmPass(!showConfirmPass)} />
                }
                value={confirmPassword}/>
            <HelperText type="error" visible={!checkConfirmPassword()} style={styles.helpertext}>
                Password do not match !
            </HelperText>

            <Button 
                mode="contained-tonal" 
                style={styles.button}
                onPress={handleRegister}
                disabled={isButtonDisabled()}>
                <Text style={styles.txtBtn}>Sign up</Text>
            </Button>
            
            <Button mode="text" style={styles.createBtn} onPress={handleGobackLogin}>or Go back to Sign In</Button>
            </View>
        </ImageBackground>
    )
    }


    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "aqua"
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20
    },
    form: {
        backgroundColor: "white", 
        padding: 30,
        borderRadius: 20
    },
    header: {
        alignSelf: "center",
        fontSize: 25,
        fontWeight: "bold",
        color: "#243b54",
        marginBottom: 20
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
        height: 40
    },

    button: {
        alignSelf: "center",
        width: 200,
        marginTop: 20,
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
        margin: -7
    }
    })