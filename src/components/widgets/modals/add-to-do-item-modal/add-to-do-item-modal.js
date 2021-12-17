import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Input,
  Paper,
  Tooltip,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/lab";
import { X as XIcon } from "../../../../icons/x";

export const AddToDoItemModal = (props) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [isDateInErrorState, setDateErrorState] = useState(false);

  const boxRef = useRef(null);

  const { onCancel, onAdd } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onCancel}
      open={true}
      onClick={(event) => {
        if (event.target === boxRef.current) {
          onCancel();
        }
      }}
    >
      {" "}
      <Box
        onSubmit={(event) => {
          event.preventDefault();
          if (enteredName.trim().length > 0 && !isDateInErrorState) {
            onAdd(enteredName, enteredDate);
          }
        }}
        component="form"
        ref={boxRef}
        sx={{
          minHeight: "100%",
          p: 3,
          position: "fixed",
          top: "0",
          left: "0",
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: 3,
            mx: "auto",
            outline: "none",
            width: 600,
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              pt: 3,
              pl: 3,
              pr: 3,
            }}
          >
            <Typography variant="h6">New To Do Item</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={onCancel}>
              <XIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ pl: 3, pr: 3, pb: 2, pt: 2 }}>
            <TextField
              autoFocus
              onChange={(event) => {
                setEnteredName(event.target.value);
              }}
              label="Enter a task..."
              defaultValue=""
              fullWidth
              placeholder="Enter a task..."
            />
          </Box>
          <Box sx={{ pl: 3, pr: 3, pb: 2, pt: 2 }}>
            <DatePicker
              value={enteredDate || null}
              onError={(event) => {
                if (!event) {
                  setDateErrorState(false);
                } else {
                  setDateErrorState(true);
                }
              }}
              label="Due Date"
              onChange={(value) => {
                setEnteredDate(value);
              }}
              renderInput={(inputProps) => (
                <TextField fullWidth {...inputProps} />
              )}
            />
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-end",
              pt: 2,
              pr: 3,
              pb: 3,
              pr: 3,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                if (enteredName.trim().length > 0 && !isDateInErrorState) {
                  onAdd(enteredName, enteredDate);
                }
              }}
            >
              Add Task
            </Button>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
  z;
};

AddToDoItemModal.propTypes = {
  onCancel: PropTypes.func,
  onAdd: PropTypes.func,
};
