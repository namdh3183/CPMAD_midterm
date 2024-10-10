import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import MyStack from "./routers/MyStack";
import { MyContextControllerProvider } from "./context";
import firebase from '@react-native-firebase/app';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTgtYO56xFTNroJjrRUh3YDihKh2yILdI",
  authDomain: "cpmad-midterm.firebaseapp.com",
  projectId: "cpmad-midterm",
  storageBucket: "cpmad-midterm.appspot.com",
  messagingSenderId: "20702471380",
  appId: "1:20702471380:android:ee2e183c81aa9cc3dd0741"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {

  return (
      <NavigationContainer>
        <PaperProvider>
          <MyStack/>
        </PaperProvider>
      </NavigationContainer>
  )
}