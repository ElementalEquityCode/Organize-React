import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import FirebaseApp from "../Firebase";

const firestore = getFirestore(FirebaseApp);

class ToDoItem {
  constructor(name, isCompleted, created, dueDate, path) {
    this.name = name;
    this.isCompleted = isCompleted;
    this.created = created;
    this.dueDate = dueDate;
    this.path = path;
  }

  setCompletionStatus = (bool) => {
    this.isCompleted = bool;

    updateDoc(doc(firestore, this.path.path), {
      is_completed: bool,
    });
  };

  deleteFromDatabase = () => {
    deleteDoc(doc(firestore, this.path.path));
  }
}

export default ToDoItem;
