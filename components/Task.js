// import { List } from "react-native-paper";
// import firestore from '@react-native-firebase/firestore';

// export default function Task({ id, title, complete }) {
//   const cJobs = firestore().collection("Jobs");
  
//   const toggleComplete = () => {
//     cJobs.doc(id)
//       .update({
//         finish: !complete
//       })
//       .then(() => console.log("Task updated"))
//       .catch(error => console.log("Error updating task:", error));
//   };
  
//   return (
//     <List.Item
//       title={title}
//       onPress={toggleComplete}
//       left={props => (
//         <List.Icon {...props} icon={complete ? "check" : "cancel"} />
//       )}
//       key={id}
//     />
//   );
// }
