import { View, StyleSheet, FlatList } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';

const cJobs = firestore().collection("Jobs");
export default function Home({navigation}) {
    const route = useRoute();
    const { userEmail } = route.params;

    const [task, SetTask] = useState("");
    const [tasks, SetTasks] = useState([]);

    const addNew = () => {
        if (task.trim() === '') {
            console.log("Task is empty.");
            return;
        }
    
        cJobs.add({
          title: task,
          finish: false,
          email: userEmail,
        })
        .then(doc => {
          doc.update({ id: doc.id })
            .then(() => console.log("Added new task and updated with id:", doc.id))
            .catch(e => console.log("Error updating task with id:", e));
        })
        .catch(e => console.log("Error adding new task:", e));
    
        SetTask("");
    };
    

    useEffect(() => {
        const unsubscribe = cJobs.where('email', '==', userEmail).onSnapshot((querySnapshot) => {
          if (!querySnapshot.empty) {
            let result = [];
            querySnapshot.forEach((doc) => {
              console.log("Document data:", doc.data());
              result.push(doc.data());
            });
            SetTasks(result);
          } else {
            console.log("No matching documents.");
            SetTasks([]);
          }
        });
      
        return () => unsubscribe();
      }, [userEmail]);
      

    const updateTask = (item) => {
        cJobs.doc(item.id).update({
        finish: !item.finish
        });
    };

    const renderItem = ({ item }) => {
        return (
          <Button 
            icon={item.finish ? "check" : "cancel"}
            onPress={() => updateTask(item)}
            contentStyle={styles.buttonContent} > 
            <Text style={styles.title}>{item.title}</Text>
          </Button>
        );
      };
      
      const handleLogout = () => {
        auth().signOut()
          .then(() => {
            console.log('User signed out!');
            // Navigate to login screen or handle post-logout actions
            navigation.navigate("Login");
          })
          .catch(error => {
            console.error('Error signing out: ', error);
          });
      };  

    return (
        
        <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="To do list"/>
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>    
      <View style={styles.email}>
        <Text style={{fontWeight: "700", fontSize: 15}}>Welcome {userEmail}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TextInput
          placeholder="Add a task"
          value={task}
          onChangeText={SetTask}
          style={styles.input}/>
        <Button mode="contained" onPress={addNew} style={styles.button}>Add</Button>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#a5c0d1', // Light background color
    },
    appbar: {
      backgroundColor: '#6200ea',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
      margin: 20,
    },
    email: {
      justifyContent: "center",
      alignItems: 'center',
      marginTop: 20,
    },
    title: {
      fontSize: 18,
    },
    button: {
      justifyContent: 'center',
      alignItems: "center",
      borderRadius: 3,
      backgroundColor: '#6200ea', // Consistent color theme
    },
    input: {
      width: '70%',
      marginRight: 10,
    },
    buttonContent: {
      justifyContent: 'flex-start',
      marginLeft: 30,
    },
    card: {
      margin: 10,
      borderRadius: 8,
      backgroundColor: '#ffffff', // White card background
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }
});
