import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import NextLink from "next/link";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/lab";
import FirebaseApp from "../../../Firebase";

const auth = getAuth(FirebaseApp);
const firestore = getFirestore(FirebaseApp);

export const ToDoItemEditForm = (props) => {
  const [itemName, setItemName] = useState("");
  const [itemDueDate, setItemDueDate] = useState(null);
  const [itemDueDateErrorState, setItemDueDateErrorState] = useState(false);

  const router = useRouter();
  const listId = router.query.list_id;
  const { ...other } = props;

  useEffect(() => {
    if (auth.currentUser && router.query.list_id && router.query.toDoItemID) {
      getDoc(
        doc(
          firestore,
          "users",
          auth.currentUser.uid,
          "to_do_items",
          router.query.list_id,
          "items",
          router.query.toDoItemID
        )
      )
        .then((data) => {
          setItemName(data.data().name);
          if (data.data().due_date) {
            setItemDueDate(new Date(data.data().due_date.seconds * 1000));
          }
        })
        .catch(() => {
          router.push('/dashboard');
        });
    } else {
      router.push('/dashboard');
    }
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (itemName.trim().length !== 0 && !itemDueDateErrorState) {
      updateDoc(
        doc(
          firestore,
          "users",
          auth.currentUser.uid,
          "to_do_items",
          router.query.list_id,
          "items",
          router.query.toDoItemID
        ),
        {
          name: itemName,
          due_date: itemDueDate,
        }
      )
        .then(() => {
          router.push(`/dashboard?list_id=${listId}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDeleteToDoItem = () => {
    deleteDoc(
      doc(
        firestore,
        "users",
        auth.currentUser.uid,
        "to_do_items",
        router.query.list_id,
        "items",
        router.query.toDoItemID
      ),
      {
        name: itemName,
        due_date: itemDueDate,
      }
    )
      .then(() => {
        router.push(`/dashboard?list_id=${listId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form {...other} onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader title="Edit To Do Item" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                name="to-do-item-name"
                required
                value={itemName}
                onChange={(event) => {
                  setItemName(event.target.value);
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <DatePicker
                value={itemDueDate || null}
                onError={(event) => {
                  if (!event) {
                    setItemDueDateErrorState(false);
                  } else {
                    setItemDueDateErrorState(true);
                  }
                }}
                label="Due Date"
                onChange={(value) => {
                  setItemDueDate(value);
                }}
                renderInput={(inputProps) => (
                  <TextField fullWidth {...inputProps} />
                )}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          ></Box>
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          ></Box>
        </CardContent>
        <CardActions
          sx={{
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Button type="submit" sx={{ m: 1 }} variant="contained">
            Update
          </Button>
          <NextLink href={`/dashboard?list_id=${listId}`} passHref>
            <Button
              component="a"
              sx={{
                m: 1,
                mr: "auto",
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </NextLink>
          <Button color="error" onClick={handleDeleteToDoItem}>
            Delete To Do Item
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
