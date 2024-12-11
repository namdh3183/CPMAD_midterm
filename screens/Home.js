import { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Appbar, Button, Text, TextInput, Menu } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

const cJobs = firestore().collection("Jobs");

export default function Home({ navigation }) {
  const route = useRoute();
  const { userEmail } = route.params;

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

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

    setTask("");
  };

  useEffect(() => {
    const unsubscribe = cJobs.where('email', '==', userEmail).onSnapshot((querySnapshot) => {
      let result = [];
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          console.log("Document data:", doc.data());
          result.push(doc.data());
        });
      } else {
        console.log("No data found!");
      }
      console.log("Setting tasks state:", result);
      setTasks(result);
    }, (error) => {
      console.log("Error fetching tasks:", error);
    });

    return () => {
      console.log("Unsubscribing from tasks listener");
      unsubscribe();
    };
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
    auth().signOut().then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
        >
          <Menu.Item onPress={handleLogout} title="Log Out" />
        </Menu>
      </Appbar.Header>
      <View style={styles.email}>
        <Text style={{ fontWeight: "700", fontSize: 22 }}>Welcome {userEmail}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TextInput
          placeholder="Add a task"
          value={task}
          onChangeText={setTask}
          style={styles.input} />
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
  },
});
