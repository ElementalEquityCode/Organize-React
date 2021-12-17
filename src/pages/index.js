import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  Box,
  Card,
  Container,
  Divider,
  Link,
  Typography,
  Stack,
} from "@mui/material";
import NextLink from "next/link";
import NotificationBanner from "../components/notification-banner/notification-banner";
import FirebaseLogin from "../components/authentication/firebase-login";

const Login = () => {
  const [notification, setNotificationMessage] = useState("");

  let timer = null;

  useEffect(() => {
    if (notification) {
      timer = setTimeout(() => {
        setNotificationMessage("");
        clearTimeout(timer);
      }, 5100);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [notification]);

  const notificationListener = (message) => {
    if (!timer) {
      setNotificationMessage(message);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Organyze</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {notification ? (
          <NotificationBanner type={notification.type}>
            {notification.message}
          </NotificationBanner>
        ) : null}
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: "60px",
              md: "120px",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Card
            elevation={16}
            sx={{
              p: 4,
              width: "inherit",
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography align="center" variant="h4">Welcome to Organyze</Typography>
              <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                The Minimalist To Do List
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              <FirebaseLogin notificationListener={notificationListener} />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <NextLink href="/register" passHref>
                <Link color="textSecondary" variant="body2">
                  Create new account
                </Link>
              </NextLink>
              <NextLink href="/reset-password" passHref>
                <Link color="textSecondary" variant="body2">
                  Forgot Password?
                </Link>
              </NextLink>
            </Stack>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
