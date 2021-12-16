import React, { useEffect, useMemo, useState, useContext } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FolderOpen as FolderIcon } from "../../icons/folder-open";
import { Scrollbar } from "../scrollbar";
import { DashboardSidebarSection } from "./dashboard-sidebar-section";
import ToDoItemList from "../../Objects/ToDoItemList";
import { AddToDoItemListModal } from "../widgets/modals/add-to-do-item-list-modal/add-to-do-item-list-modal";
import ToDoItemsListContext from "../../contexts/to-do-item-lists-context";

const disableScrolling = () => {
  document.body.style.overflowY = 'hidden';
};

const enableScrolling = () => {
  document.body.style.overflowY = '';
};

const getSections = (toDoItemLists) => {
  let sections = [];

  toDoItemLists.forEach((toDoItemList) => {
    sections.push({
      title: toDoItemList.name,
      id: toDoItemList.path.id,
      path: `/dashboard?list_id=${toDoItemList.path.id}`,
      icon: <FolderIcon fontSize="small" />,
    });
  });

  return [
    {
      title: "Lists",
      items: sections,
    },
  ];
};

export const DashboardSidebar = (props) => {
  const action = useContext(ToDoItemsListContext).addToDoItemList;
  const [isModalOpen, setModalOpenState] = useState(false);
  const { onClose, open, email, toDoItemLists } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    noSsr: true,
  });
  const sections = useMemo(() => getSections(toDoItemLists));

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(handlePathChange, [router.isReady, router.asPath]);

  const handleCloseModal = () => {
    setModalOpenState(false);
    enableScrolling();
  };

  const handleAddList = (listName) => {
    action(listName);
    setModalOpenState(false);
    enableScrolling();
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div>
            <Box sx={{ pt: 3, pl: 3, pr: 3, pb: 0, px: 2 }}>
              <Box
                sx={{
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  px: 3,
                  py: "11px",
                  borderRadius: 1,
                }}
              >
                <div>
                  <Typography color="inherit" variant="subtitle1">
                    {email}
                  </Typography>
                  <Typography color="neutral.400" variant="body2">
                    Your Tier: Free
                  </Typography>
                </div>
              </Box>
            </Box>
          </div>
          <Divider
            sx={{
              borderColor: "#2D3748",
              my: 3,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={"1"}
                path={router.asPath}
                sx={{
                  mt: 2,
                  "& + &": {
                    mt: 2,
                  },
                }}
                {...section}
              />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: "#2D3748",
            }}
          />
          <Box sx={{ p: 2 }}>
            <Button
              color="secondary"
              component="a"
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => {
                setModalOpenState(true);
                disableScrolling();
              }}
            >
              Create new list
            </Button>
          </Box>
        </Box>
        {isModalOpen ? (
          <AddToDoItemListModal
            onCancel={handleCloseModal}
            onAdd={handleAddList}
          />
        ) : null}
      </Scrollbar>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            borderRightColor: "divider",
            borderRightStyle: "solid",
            borderRightWidth: (theme) =>
              theme.palette.mode === "dark" ? 1 : 0,
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  email: PropTypes.string,
  toDoItemLists: PropTypes.arrayOf(PropTypes.instanceOf(ToDoItemList)),
};
