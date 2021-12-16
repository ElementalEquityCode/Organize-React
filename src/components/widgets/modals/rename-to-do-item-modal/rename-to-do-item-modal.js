import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { Search as SearchIcon } from "../../../../icons/search";
import { X as XIcon } from "../../../../icons/x";
import styles from "./rename-to-do-item-modal.module.css";

export const RenameToDoItemListModal = (props) => {
  const [enteredValue, setEnteredValue] = useState("");

  const boxRef = useRef(null);

  const { onCancel, onRename } = props;

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
          if (enteredValue.trim().length > 0) {
            onRename(enteredValue);
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
        <Container maxWidth="sm">
          <Paper elevation={12}>
            <Box sx={{ pt: 3, pr: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={onCancel}>
                  <XIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ pb: 3, pt: 2 }}>
              <Container maxWidth="sm">
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
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
                    placeholder="Enter new list name..."
                    label="Enter new list name..."
                    onChange={(event) => {
                      setEnteredValue(event.target.value);
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (enteredValue.trim().length > 0) {
                        onRename(enteredValue);
                      }
                    }}
                    size="large"
                    sx={{ ml: 2 }}
                    variant="contained"
                  >
                    Rename
                  </Button>
                </Box>
              </Container>
            </Box>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

RenameToDoItemListModal.propTypes = {
  onRename: PropTypes.func,
  onCancel: PropTypes.func,
};
