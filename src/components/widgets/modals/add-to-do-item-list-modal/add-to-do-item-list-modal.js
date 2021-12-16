import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { X as XIcon } from "../../../../icons/x";
import styles from "./add-to-do-item-list-modal.module.css";

export const AddToDoItemListModal = (props) => {
  const [enteredName, setEnteredName] = useState("");

  const boxRef = useRef(null);

  const { onCancel, onAdd } = props;

  return (
    <div
      onClick={(event) => {
        if (event.target === boxRef.current) {
          onCancel();
        }
      }}
      className={styles.visible}
    >
      <Box
        onSubmit={(event) => {
          event.preventDefault();
          if (enteredName.trim().length > 0) {
            onAdd(enteredName);
          }
        }}
        component="form"
        ref={boxRef}
        sx={{
          backgroundColor: "background.modal",
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
            <Typography variant="h6">Create a new List</Typography>
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
              label="Enter a name for your new list..."
              defaultValue=""
              fullWidth
              placeholder="Enter a name for your new list..."
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
              variant="contained"
              onClick={() => {
                if (enteredName.trim().length > 0) {
                  onAdd(enteredName);
                }
              }}
            >
              Create
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
  z;
};

AddToDoItemListModal.propTypes = {
  onCancel: PropTypes.func,
  onAdd: PropTypes.func,
  show: PropTypes.bool,
};
