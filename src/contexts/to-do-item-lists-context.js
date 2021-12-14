import React from "react";

const ToDoItemsListContext = React.createContext({
  toDoItemList: [],
  deleteToDoItemList: () => {},
  renameToDoItemList: () => {},
  addToDoItem: () => {}
});

export default ToDoItemsListContext;
