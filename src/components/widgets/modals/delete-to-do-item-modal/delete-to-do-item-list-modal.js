import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Container, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/WarningOutlined';
import styles from './delete-to-do-item-list-modal.module.css';

export const DeleteToDoItemListModal = (props) => {
  const deleteToDoItemListModalContainerRef = useRef(null);
  const boxRef = useRef(null);
  const { onCancel } = props;
  const { onDelete } = props;
  
  useEffect(() => {
    deleteToDoItemListModalContainerRef.current.classList.add(`${styles.visible}`);
  });

  return (
    <div
      onClick={(event) => {
        if (event.target === deleteToDoItemListModalContainerRef.current || event.target === boxRef.current) {
          onCancel();
        }
      }}
      className={styles.hidden}
      ref={deleteToDoItemListModalContainerRef}
    >
      <Box
        ref={boxRef}
        sx={{
          backgroundColor: 'background.modal',
          minHeight: '100%',
          p: 3,
          position: 'fixed',
          top: '0',
          left: '0',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1300',
          overflow: 'hidden'
        }}
        >
          <Container maxWidth="sm">
            <Paper elevation={12}>
              <Box
                sx={{
                  display: 'flex',
                  pb: 2,
                  pt: 3,
                  px: 3
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                    color: 'error.main',
                    mr: 2
                  }}
                >
                  <WarningIcon fontSize="small" />
                </Avatar>
                <div>
                  <Typography variant="h5">
                    Delete To Do Item List
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Are you sure you want to delete this list? Once deleted, the list cannot be recovered.
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  px: 3,
                  py: 2,
                  pb: 3
                }}
              >
                <Button
                  sx={{ mr: 2 }}
                  variant="outlined"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    backgroundColor: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.dark'
                    }
                  }}
                  variant="contained"
                  onClick={onDelete}
                >
                  Delete List
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
    </div>
  );
};

DeleteToDoItemListModal.propTypes = {
  onDelete: PropTypes.func,
  onCancel: PropTypes.func
};
