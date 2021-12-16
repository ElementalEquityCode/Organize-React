import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";
import { DashboardNavbar } from "../../../../components/dashboard/dashboard-navbar";
import { Avatar, Box, Chip, Container, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToDoItemEditForm } from "../../../../components/dashboard/to-do-item/to-do-item-edit-form";

class EditToDoItemLayout extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <>
        <Head>
          <title>Edit To Do Item | Organyze</title>
        </Head>
        <main>
          <DashboardNavbar fullSizeAlways />
          <ToDoItemEdit />
        </main>
      </>
    );
  }
}

const ToDoItemEdit = () => {
  const router = useRouter();
  const listId = router.query.list_id;
  const [customer, setCustomer] = useState(null);

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          py: 8,
          pt: 16,
        }}
      >
        <Container maxWidth="xlg">
          <Box sx={{ mb: 4 }}>
            <NextLink href={`/dashboard?list_id=${listId}`} passHref>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Dashboard</Typography>
              </Link>
            </NextLink>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography variant="subtitle2">To Do Item ID:</Typography>
                <Chip
                  label={`${router.query.toDoItemID}`}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ToDoItemEditForm />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default EditToDoItemLayout;
