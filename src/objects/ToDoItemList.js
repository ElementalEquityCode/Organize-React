import { deleteDoc } from 'firebase/firestore';

class ToDoItemList {
  constructor(name, created, path) {
    this.name = name;
    this.created = created;
    this.path = path;
    this.toDoItems = [];
    this.completedToDoItems = [];
  }

  deleteListFromDatabase = async (completion) => {
    await this.toDoItems.forEach((toDoItem) => {
      deleteDoc(toDoItem.path);
    });

    if (this.path) {
      await deleteDoc(this.path);
      completion();
    }
  }
}

export default ToDoItemList;
