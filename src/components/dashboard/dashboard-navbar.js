import React, { useRef, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Menu as MenuIcon } from "../../icons/menu";
import { AccountPopover } from "./account-popover";
import { ContentSearchDialog } from "./content-search-dialog";
import { RenameToDoItemListModal } from "../widgets/modals/rename-to-do-item-modal/rename-to-do-item-modal";
import { DeleteToDoItemListModal } from "../widgets/modals/delete-to-do-item-modal/delete-to-do-item-list-modal";
import { Trash as TrashIcon } from "../../icons/trash";
import { UserCircle as UserCircleIcon } from "../../icons/user-circle";
import { Search as SearchIcon } from "../../icons/search";
import { Pencil as PencilIcon } from "../../icons/pencil";
import FirebaseApp from "../../Firebase";
import ToDoItemListContext from "../../contexts/to-do-item-lists-context";

const auth = getAuth(FirebaseApp);
const storage = getStorage(FirebaseApp);

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === "light"
    ? {
        boxShadow: theme.shadows[3],
      }
    : {
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        boxShadow: "none",
      }),
}));

const ContentSearchButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenSearchDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton onClick={handleOpenSearchDialog} sx={{ ml: 1 }}>
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <ContentSearchDialog
        onClose={handleCloseSearchDialog}
        open={openDialog}
      />
    </>
  );
};

const RenameListButton = () => {
  const router = useRouter();
  const action = useContext(ToDoItemListContext).renameToDoItemList;

  const anchorRef = useRef(null);
  const [isModalOpen, setModalOpenState] = useState(false);

  const handleCloseModal = () => {
    setModalOpenState(false);
  };

  const handleRenameToDoItemList = (withName) => {
    setModalOpenState(false);
    action(withName, router.query.id);
  };

  return (
    <>
      <Tooltip title="Rename List">
        <IconButton
          onClick={() => {
            setModalOpenState(true);
          }}
          sx={{ ml: 1 }}
          ref={anchorRef}
        >
          <PencilIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {isModalOpen ? (
        <RenameToDoItemListModal
          onRename={handleRenameToDoItemList}
          onCancel={handleCloseModal}
        />
      ) : null}
    </>
  );
};

const DeleteToDoItemListButton = () => {
  const router = useRouter();
  const action = useContext(ToDoItemListContext).deleteToDoItemList;

  const anchorRef = useRef(null);
  const [isModalOpen, setModalOpenState] = useState(false);

  const handleCloseModal = () => {
    setModalOpenState(false);
  };

  const handleDeleteToDoItemList = () => {
    setModalOpenState(false);
    action(router.query.id);
  };

  return (
    <>
      <Tooltip title="Delete List">
        <IconButton
          onClick={() => {
            setModalOpenState(true);
          }}
          ref={anchorRef}
          sx={{ ml: 1 }}
        >
          <TrashIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {isModalOpen ? (
        <DeleteToDoItemListModal
          onDelete={handleDeleteToDoItemList}
          onCancel={handleCloseModal}
        />
      ) : null}
    </>
  );
};

const AccountButton = () => {
  const [user, setUser] = useState({
    avatar: "",
    email: "",
  });
  const anchorRef = useRef(null);
  const [openPopover, setOpenPopover] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      getDownloadURL(
        ref(storage, `users/${auth.currentUser.uid}/profile_image`)
      )
        .then((url) => {
          setUser({
            avatar: url,
            email: auth.currentUser.email,
          });
        })
        .catch((error) => {
          setUser({
            avatar: null,
            email: auth.currentUser.email,
          });
        });
    }
  }, []);

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: "center",
          display: "flex",
          ml: 2,
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40,
          }}
          src={user.avatar}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
      </Box>
      <AccountPopover
        user={user}
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

export const DashboardNavbar = (props) => {
  const { onOpenSidebar, ...other } = props;

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <ContentSearchButton />
          <RenameListButton />
          <DeleteToDoItemListButton />
          <AccountButton />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};
