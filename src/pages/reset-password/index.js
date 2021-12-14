import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Card, Container, Typography } from "@mui/material";
import NotificationBanner from "../../components/notification-banner/notification-banner";
import PasswordRecoveryForm from "../../components/authentication/password-recovery-form";

const ResetPassword = () => {
  const [notification, setNotificationMessage] = useState("");

  let timer = null;

  useEffect(() => {
    if (notification) {
      timer = setTimeout(() => {
        setNotificationMessage("");
        clearTimeout(timer);
      }, 5100);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [notification]);

  const notificationListener = (message) => {
    if (!timer) {
      setNotificationMessage(message);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | Organize</title>
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
              <Typography variant="h4">Forgot Your Password?</Typography>
              <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                Enter Your Email to Reset It
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              <PasswordRecoveryForm
                notificationListener={notificationListener}
              />
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default ResetPassword;
