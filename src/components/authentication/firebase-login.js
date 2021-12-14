import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Button, FormHelperText, TextField } from "@mui/material";
import { AuthContext } from "../../contexts/firebase-auth-context";

const validator = require("email-validator");

const FirebaseLogin = (props) => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const { notificationListener } = props;

  const [email, setEmail] = useState("");
  const [isEmailInErrorState, setEmailErrorState] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordInErrorState, setPasswordErrorState] = useState(false);

  useEffect(() => {
    if (authContext.isAuthenticated) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    if (!validator.validate(email)) {
      setEmailErrorState(true);
    }
    if (password.length === 0) {
      setPasswordErrorState(true);
    }

    if (validator.validate(email) && password.length !== 0) {
      const possibleError = await authContext.signIn(email, password);

      if (possibleError) {
        notificationListener({
          message: possibleError.message,
          type: "error",
        });
      }
    }
  };

  return (
    <div>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          mt: 2,
        }}
      ></Box>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleLogin();
        }}
      >
        <TextField
          autoFocus
          error={isEmailInErrorState}
          fullWidth
          helperText={
            isEmailInErrorState ? "An email address is required" : null
          }
          label="Email"
          margin="normal"
          name="email"
          onFocus={() => {
            setEmailErrorState(false);
          }}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          type="email"
          value={email}
        />
        <TextField
          error={isPasswordInErrorState}
          fullWidth
          helperText={isPasswordInErrorState ? "A password is required" : null}
          label="Password"
          margin="normal"
          name="password"
          onFocus={() => {
            setPasswordErrorState(false);
          }}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          type="password"
          value={password}
        />
        <Box sx={{ mt: 2 }}>
          <Button fullWidth size="large" type="submit" variant="contained">
            Login
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}></Box>
      </form>
    </div>
  );
};

FirebaseLogin.propTypes = {
  notificationListener: PropTypes.func,
};

export default FirebaseLogin;
