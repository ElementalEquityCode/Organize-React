import React, { useState } from "react";
import { useRouter } from 'next/router';
import PropTypes from "prop-types";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Box, Button, FormHelperText, TextField } from "@mui/material";
import FirebaseApp from "../../Firebase";

const validator = require("email-validator");
const auth = getAuth(FirebaseApp);

const PasswordRecoveryForm = (props) => {
  const { notificationListener } = props;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailInErrorState, setEmailErrorState] = useState(false);

  const handlePasswordReset = () => {
    if (validator.validate(email)) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          notificationListener({
            message: `An email was sent to ${email} to reset your password`,
            type: "success",
          }, true);
          setTimeout(() => {
            router.push('/');
          }, 5100);
        })
        .catch((error) => {
          notificationListener({
            message: error.message,
            type: "error",
          });
        });
    } else {
      setEmailErrorState(true);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        handlePasswordReset();
      }}
    >
      <TextField
        autoFocus
        error={isEmailInErrorState}
        fullWidth
        helperText={isEmailInErrorState ? "An email address is required" : null}
        label="Email Address"
        margin="normal"
        name="email"
        onBlur={() => {
          setEmailErrorState(false);
        }}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        type="email"
        value={email}
      />
      <Box sx={{ mt: 3 }}>
        <Button fullWidth size="large" type="submit" variant="contained">
          Send Password Reset Email
        </Button>
      </Box>
    </form>
  );
};

PasswordRecoveryForm.propTypes = {
  notificationListener: PropTypes.func,
};

export default PasswordRecoveryForm;
