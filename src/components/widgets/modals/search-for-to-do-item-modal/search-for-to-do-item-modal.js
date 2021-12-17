import { Fragment, useState, useContext } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../../../../icons/search";
import { wait } from "../../../../utils/wait";
import { X as XIcon } from "../../../../icons/x";
import PropTypes from "prop-types";
import ToDoItemListsContext from "../../../../contexts/to-do-item-lists-context";
import Checkbox from "../../inputs/checkbox/checkbox";
import ToDoItemListContext from "../../../../contexts/to-do-item-lists-context";

const results = {};

export const SearchForToDoItemModal = (props) => {
  const { onClose, open, ...other } = props;
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const toDoItemLists = useContext(ToDoItemListsContext).toDoItemLists;

  const action = useContext(ToDoItemListContext).didClickCheckmark;

  const handleSubmit = async (event) => {
    results = {};
    event.preventDefault();
    setShowResults(false);
    setIsLoading(true);

    toDoItemLists.forEach((list) => {
      searchForToDoItemInList(list.path.id, list.name, list.toDoItems, value);
      searchForToDoItemInList(
        list.path.id,
        list.name,
        list.completedToDoItems,
        value
      );
    });

    await wait(500);
    setIsLoading(false);
    setShowResults(true);
  };

  const searchForToDoItemInList = (listId, listName, list, value) => {
    list.forEach((toDoItem) => {
      if (toDoItem.name.toLowerCase().includes(value.toLowerCase())) {
        if (!results[listName]) {
          results[listName] = [
            {
              description: toDoItem.name,
              title: toDoItem.path.id,
              path: listId,
              isComplete: toDoItem.isCompleted,
              object: toDoItem,
            },
          ];
        } else {
          results[listName].push({
            description: toDoItem.name,
            title: toDoItem.path.id,
            path: listId,
            isComplete: toDoItem.isCompleted,
            object: toDoItem,
          });
        }
      }
    });
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6">Search</Typography>
        <IconButton color="inherit" onClick={onClose}>
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            label="Search"
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search..."
            sx={{ mt: 3 }}
            value={value}
          />
        </form>
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {showResults && (
          <>
            {Object.keys(results).map((type, index) => (
              <div key={index}>
                <Typography sx={{ my: 2 }} variant="h6">
                  {type}
                </Typography>
                <Box
                  sx={{
                    borderColor: "divider",
                    borderRadius: 1,
                    borderStyle: "solid",
                    borderWidth: 1,
                  }}
                >
                  {results[type].map((result, index) => (
                    <Fragment key={result.title}>
                      <Box sx={{ p: 2 }}>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Checkbox
                            isChecked={result.isComplete}
                            onCheckboxClicked={(completionStatus) => {
                              result.object.setCompletionStatus(
                                completionStatus
                              );
                              action(result.object, result.path);
                            }}
                          />
                          <Typography variant="subtitle1" sx={{ ml: 2 }}>
                            {result.title}
                          </Typography>
                        </Box>
                        <Typography color="textSecondary" variant="body2">
                          {result.path}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          sx={{ mt: 1, wordBreak: "break-word" }}
                        >
                          {result.description}
                        </Typography>
                      </Box>
                      {index !== results[type].length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </Box>
              </div>
            ))}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

SearchForToDoItemModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
