import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Chip, Container, Typography } from "@mui/material";
import styles from "./notification-banner.module.css";

const NotificationBanner = (props) => {
  const { type } = props;
  const { children } = props;

  const notificationBannerRef = useRef();

  let timer = null;
  let timer2 = null;

  useEffect(() => {
    timer = setTimeout(() => {
      if (notificationBannerRef.current.classList !== null) {
        notificationBannerRef.current.classList.add(styles.visible);
        timer2 = setTimeout(() => {
          notificationBannerRef.current.classList.remove(styles.visible);
        }, 4000);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  });

  return (
    <div
      ref={notificationBannerRef}
      className={`${styles.notificationBanner} ${styles.hidden}`}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 1,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Chip
              color={type}
              label={type.toUpperCase()}
              sx={{ mr: 2 }}
              size="small"
            />
            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
              {children}
            </Typography>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                "& img": {
                  height: 30,
                  m: 1,
                },
              }}
            ></Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

NotificationBanner.propTypes = {
  children: PropTypes.string,
  type: PropTypes.string,
};

export default NotificationBanner;
