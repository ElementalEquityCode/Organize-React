import React, { useState, useRef, useContext } from "react";
import Head from "next/head";
import Router from "next/router";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ToDoItemsListTable from "../../components/dashboard/to-do-items-list-table";
import { getAuth } from "firebase/auth";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { Plus as PlusIcon } from "../../icons/plus";
import { Search as SearchIcon } from "../../icons/search";
import { AddToDoItemModal } from "../../components/widgets/modals/add-to-do-item-modal/add-to-do-item-modal";
import { DashboardNavbar } from "../../components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "../../components/dashboard/dashboard-sidebar";
import ToDoItem from "../../Objects/ToDoItem";
import ToDoItemList from "../../Objects/ToDoItemList";
import ToDoItemsListContext from "../../contexts/to-do-item-lists-context";
import FirebaseApp from "../../Firebase";

const auth = getAuth(FirebaseApp);
const firestore = getFirestore(FirebaseApp);

class DashboardContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isSidebarOpen: false,
      toDoItemLists: [],
      currentlyViewedList: null,
    };
  }

  onOpenSidebar = () => {
    this.setState({
      isSidebarOpen: true,
    });
  };

  onSidebarClose = () => {
    this.setState({
      isSidebarOpen: false,
    });
  };

  componentDidMount() {
    this.fetchUserDataFromFirebase();

    Router.events.on("routeChangeComplete", () => {
      const param = Router.query.id;

      if (param) {
        const { toDoItemLists } = this.state;
        for (
          let listIndex = 0;
          listIndex < toDoItemLists.length;
          listIndex += 1
        ) {
          if (toDoItemLists[listIndex].path.id === param) {
            this.setState({
              currentlyViewedList: toDoItemLists[listIndex],
            });
            break;
          }
        }
      } else {
        this.setState({
          currentlyViewedList: null,
        });
      }
    });
  }

  fetchUserDataFromFirebase = async () => {
    const docRef = collection(
      firestore,
      "users",
      auth.currentUser.uid,
      "to_do_items"
    );
    const collectionsQuery = query(docRef, orderBy("created"));
    const snapshot = await getDocs(collectionsQuery);

    const lists = [];

    snapshot.docs.forEach(async (document, index) => {
      const toDoItemList = new ToDoItemList(
        document.data().list_name,
        new Date(document.data().created.seconds * 1000),
        document.ref
      );

      const toDoItemsCollectionReference = collection(
        firestore,
        document.ref.path,
        "items"
      );
      const toDoItemsCollectionReferenceQuery = query(
        toDoItemsCollectionReference,
        orderBy("created")
      );
      const toDoItems = await getDocs(toDoItemsCollectionReferenceQuery);

      toDoItems.forEach((toDoItem) => {
        const item = new ToDoItem(
          toDoItem.data().name,
          toDoItem.data().is_completed,
          toDoItem.data().created.toDate(),
          toDoItem.data().due_date ? toDoItem.data().due_date.toDate() : null,
          toDoItem.ref
        );

        if (item.isCompleted) {
          toDoItemList.completedToDoItems.push(item);
        } else {
          toDoItemList.toDoItems.push(item);
        }
      });

      lists.push(toDoItemList);

      if (snapshot.docs.length === index + 1) {
        this.setState(
          {
            toDoItemLists: lists,
            isLoggedIn: true,
          },
          () => {
            const { toDoItemLists } = this.state;

            if (toDoItemLists) {
              Router.push(`/dashboard?id=${toDoItemLists[0].path.id}`);
            }
          }
        );
      }
    });
  };

  handleDeleteToDoItem = (toDoItem) => {
    const { currentlyViewedList } = this.state;
    const listToSearch = !toDoItem.isCompleted
      ? currentlyViewedList.toDoItems
      : currentlyViewedList.completedToDoItems;

    for (
      let toDoItemIndex = 0;
      toDoItemIndex < listToSearch.length;
      toDoItemIndex++
    ) {
      if (toDoItem.path === listToSearch[toDoItemIndex].path) {
        toDoItem.deleteFromDatabase();
        listToSearch.splice(toDoItemIndex, 1);
        break;
      }
    }

    this.setState({
      currentlyViewedList: { ...currentlyViewedList },
    });
  };

  handleCompletionStatusChanged = (toDoItem) => {
    setTimeout(() => {
      const { currentlyViewedList } = this.state;

      let list = toDoItem.isCompleted
        ? currentlyViewedList.toDoItems
        : currentlyViewedList.completedToDoItems;

      for (
        let toDoItemIndex = 0;
        toDoItemIndex < list.length;
        toDoItemIndex++
      ) {
        if (toDoItem.path === list[toDoItemIndex].path) {
          list.splice(toDoItemIndex, 1);
          if (toDoItem.isCompleted) {
            currentlyViewedList.completedToDoItems.push(toDoItem);
          } else {
            currentlyViewedList.toDoItems.push(toDoItem);
          }
          break;
        }
      }

      this.setState({
        currentlyViewedList: { ...currentlyViewedList },
      });
    }, 250);
  };

  handleAddToDoItemList = (listName) => {
    const { toDoItemLists } = this.state;
    const listUUID = uuid().toUpperCase();
    const docReference = doc(
      firestore,
      "users",
      auth.currentUser.uid,
      "to_do_items",
      listUUID
    );

    const createdTimestamp = new Date();
    const toDoItemList = new ToDoItemList(
      listName,
      createdTimestamp,
      docReference
    );

    const copyOfToDoItemLists = [...toDoItemLists];

    copyOfToDoItemLists.push(toDoItemList);

    this.setState(
      {
        toDoItemLists: copyOfToDoItemLists,
      },
      () => {
        setDoc(docReference, {
          created: createdTimestamp,
          list_name: listName,
        });

        Router.push(`/dashboard?id=${listUUID}`, undefined, {
          shallow: true,
        });
      }
    );
  };

  handleAddToDoItem = (itemName, dueDate) => {
    const { currentlyViewedList } = this.state;

    const docReference = doc(
      firestore,
      "users",
      auth.currentUser.uid,
      "to_do_items",
      currentlyViewedList.path.id,
      "items",
      uuid().toUpperCase()
    );

    const createdTimestamp = new Date();
    const toDoItem = new ToDoItem(
      itemName,
      false,
      createdTimestamp,
      dueDate,
      docReference
    );

    const copyOfCurrentlyViewedList = { ...currentlyViewedList };

    copyOfCurrentlyViewedList.toDoItems.push(toDoItem);

    this.setState(
      {
        currentlyViewedList: copyOfCurrentlyViewedList,
      },
      () => {
        setDoc(docReference, {
          created: createdTimestamp,
          due_date: dueDate,
          is_completed: false,
          name: itemName,
        });
      }
    );
  };

  handleRenameToDoItemList = async (withName, id) => {
    const { toDoItemLists } = this.state;
    const toDoItemListsCopy = [...toDoItemLists];

    for (
      let listIndex = 0;
      listIndex < toDoItemListsCopy.length;
      listIndex += 1
    ) {
      if (toDoItemListsCopy[listIndex].path.id === id) {
        toDoItemListsCopy[listIndex].name = withName;

        if (auth.currentUser) {
          await updateDoc(
            doc(firestore, "users", auth.currentUser.uid, "to_do_items", id),
            {
              list_name: withName,
            }
          )
            .then(() => {
              this.setState({
                toDoItemLists: toDoItemListsCopy,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  };

  handleDeleteToDoItemList = async (id) => {
    const { toDoItemLists } = this.state;
    const toDoItemListsCopy = [...toDoItemLists];

    for (
      let listIndex = 0;
      listIndex < toDoItemListsCopy.length;
      listIndex += 1
    ) {
      if (toDoItemListsCopy[listIndex].path.id === id) {
        await toDoItemListsCopy[listIndex].deleteListFromDatabase(() => {
          toDoItemListsCopy.splice(listIndex, 1);
        });
        break;
      }
    }

    this.setState(
      {
        toDoItemLists: toDoItemListsCopy,
      },
      () => {
        const { toDoItemLists } = this.state;
        if (toDoItemLists.length > 0) {
          Router.push(`/dashboard?id=${toDoItemLists[0].path.id}`, undefined, {
            shallow: true,
          });
        } else {
          Router.push("/dashboard", undefined, {
            shallow: true,
          });
        }
      }
    );
  };

  render() {
    const { currentlyViewedList, isSidebarOpen, toDoItemLists } = this.state;

    return (
      <>
        <Head>
          <title>Organize - Dashboard</title>
        </Head>
        <main>
          <ToDoItemsListContext.Provider
            value={{
              toDoItemLists,
              deleteToDoItemList: this.handleDeleteToDoItemList,
              renameToDoItemList: this.handleRenameToDoItemList,
              addToDoItem: this.handleAddToDoItem,
              addToDoItemList: this.handleAddToDoItemList,
              didClickCheckmark: this.handleCompletionStatusChanged,
              didDeleteToDoItem: this.handleDeleteToDoItem,
            }}
          >
            <Dashboard list={currentlyViewedList} />
            <DashboardSidebar
              open={isSidebarOpen}
              onClose={this.onSidebarClose}
              email={auth.currentUser?.email}
              toDoItemLists={toDoItemLists}
            />
            <DashboardNavbar onOpenSidebar={this.onOpenSidebar} />
          </ToDoItemsListContext.Provider>
        </main>
      </>
    );
  }
}

const disableScrolling = () => {
  document.body.style.overflowY = 'hidden';
};

const enableScrolling = () => {
  document.body.style.overflowY = '';
};

const tabs = [
  {
    label: "Tasks",
    value: "tasks",
  },
  {
    label: "Completed",
    value: "completed",
  },
];

const sortOptions = [
  {
    label: "Oldest (Created)",
    value: "created|desc",
  },
  {
    label: "Newest (Created)",
    value: "created|asc",
  },
];

const applyFilters = (currentlyViewedList, filters) => {
  let filteredToDoItems = [];

  if (currentlyViewedList) {
    if (filters.items === "tasks") {
      currentlyViewedList.toDoItems.forEach((toDoItem) => {
        if (toDoItem.name.toLowerCase().includes(filters.query.toLowerCase())) {
          filteredToDoItems.push(toDoItem);
        }
      });
    } else if (filters.items === "completed") {
      currentlyViewedList.completedToDoItems.forEach((toDoItem) => {
        if (toDoItem.name.toLowerCase().includes(filters.query.toLowerCase())) {
          filteredToDoItems.push(toDoItem);
        }
      });
    }
  }
  return filteredToDoItems;
};

const applySort = (toDoItems, sort) => {
  const order = sort.split("|")[1];

  if (order === "asc") {
    toDoItems.sort((a, b) => {
      return b.created.getTime() - a.created.getTime();
    });
  } else if (order === "desc") {
    toDoItems.sort((a, b) => {
      return a.created.getTime() - b.created.getTime();
    });
  }
  return toDoItems;
};

const applyPagination = (toDoItems, page, rowsPerPage) =>
  toDoItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const Dashboard = (props) => {
  const { list } = props;

  const action = useContext(ToDoItemsListContext).addToDoItem;

  const [isModalOpen, setModalOpenState] = useState(false);

  const handleCloseModal = () => {
    setModalOpenState(false);
    enableScrolling();
  };

  const handleAddItem = (itemName, dueDate) => {
    action(itemName, dueDate);
    setModalOpenState(false);
    enableScrolling();
  };

  const queryRef = useRef(null);
  const [currentTab, setCurrentTab] = useState("tasks");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    query: "",
    items: "tasks",
  });

  const handleTabsChange = (event, value) => {
    const updatedFilters = {
      ...filters,
      items: value,
    };
    setFilters(updatedFilters);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    event.preventDefault();

    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value,
    }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const filteredToDoItems = applyFilters(list, filters);
  const sortedToDoItems = applySort(filteredToDoItems, sort);

  const paginatedToDoItems = applyPagination(
    sortedToDoItems,
    page,
    rowsPerPage
  );

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          pt: 8,
          pl: {
            md: 0,
            lg: 35,
          },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4, pt: 8 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">{list ? list.name : ""}</Typography>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    setModalOpenState(true);
                    disableScrolling();
                  }}
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                  disabled={list === null}
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ px: 3 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
            <Divider />
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                m: -1.5,
                p: 3,
              }}
            >
              <Box
                component="form"
                sx={{
                  flexGrow: 1,
                  m: 1.5,
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search task by name"
                  onChange={(event) => {
                    const value = {
                      value: event.target.value,
                    };
                    handleQueryChange(event);
                  }}
                />
              </Box>
              <TextField
                label="Sort By"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            {list !== null ? (
              <ToDoItemsListTable
                toDoItems={{ list: paginatedToDoItems, id: list?.path.id }}
                toDoItemsCount={filteredToDoItems.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                page={page}
              />
            ) : null}
          </Card>
        </Container>
      </Box>
      {isModalOpen ? (
        <AddToDoItemModal onAdd={handleAddItem} onCancel={handleCloseModal} />
      ) : null}
    </>
  );
};

export default DashboardContainer;
