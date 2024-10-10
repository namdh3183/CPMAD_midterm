import { createContext, useContext, useMemo, useReducer } from "react";
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"

const MyContext = createContext()
MyContext.displayName = "My To do App"

const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return {...state, userLogin: action.value}
        case "LOGOUT":
            return {...state, userLogin: null}
        default:
            throw new Error("Unknown action")
    }
}

// My context
const MyContextControllerProvider = ({children}) => {
    const initialState = {
        userLogin: null,
        jobs: []
    }

    const [controller, dispatch] = useReducer(reducer, initialState)

    const value = useMemo(() => [controller, dispatch])

    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    )
}

const useMyContextProvider = () => {
    const context = useContext(MyContext)
    if(!context)
        return new Error("useMyContextProvider need to be putted inside MyContextControllerProvider")
    
    return context
}

// Reference collections
const Users = firestore().collection("Users")

// Define Actions
const createAccount = (email, password, fullname) => {
    return auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User created: ", userCredential.user)
            return Users.doc(userCredential.user.uid)
                .set({
                    email,
                    fullname
                })
                .then(() => {
                    console.log("User added to Firestore.")
                    alert("You have been registered")
                })
                .catch(e => {
                    console.error("Error adding user to Firestore: ", e)
                    throw e
                })
        })
        .catch(e => {
            console.error("Error creating user: ", e)
            throw e
        })
}


const login = (dispatch, email, password) => {
    auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        Users.doc(email)
        .onSnapshot(u => {
            if(u.exists) {
                console.log("Sign in successfully !")
                dispatch({type: "USER_LOGIN", value: u.data})
            }
        })
    })
    .catch(e => alert("Incorrect email or password !"))
}

const logout = (dispatch) => {
    auth().signOut()
    .then(() => dispatch({type: "LOGOUT"}))
}

export {
    MyContextControllerProvider,
    useMyContextProvider,
    createAccount,
    login,
    logout
}