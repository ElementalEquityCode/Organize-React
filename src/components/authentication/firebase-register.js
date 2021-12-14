import React, { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import FirebaseApp from "../../Firebase";

const validator = require("email-validator");
const auth = getAuth(FirebaseApp);
const firestore = getFirestore(FirebaseApp);

const FirebaseRegister = (props) => {
  const { notificationListener } = props;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailInErrorState, setEmailErrorState] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordInErrorState, setPasswordErrorState] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isConfirmedPasswordInErrorState, setConfirmedPasswordErrorState] =
    useState(false);

  const handleRegister = () => {
    if (!validator.validate(email)) {
      setEmailErrorState(true);
    }
    if (password.length === 0) {
      setPasswordErrorState(true);
    }
    if (confirmedPassword.length === 0) {
      setConfirmedPasswordErrorState(true);
    }

    if (validator.validate(email) && password === confirmedPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (user) => {
          await setDoc(doc(firestore, "users", user.user.uid), {
            email,
            profile_image_url: "nil",
          });

          const uuidOfFirstList = uuid().toUpperCase();

          await setDoc(
            doc(
              firestore,
              "users",
              user.user.uid,
              "to_do_items",
              uuidOfFirstList
            ),
            {
              list_name: "Home",
              created: serverTimestamp(),
            }
          );

          await setDoc(
            doc(
              firestore,
              "users",
              user.user.uid,
              "to_do_items",
              uuidOfFirstList,
              "items",
              uuid().toUpperCase()
            ),
            {
              created: serverTimestamp(),
              due_date: null,
              is_completed: false,
              name: "First Item",
            }
          );
          router.replace("/dashboard");
        })
        .catch((error) => {
          notificationListener({
            message: error.message,
            type: "error",
          });
        });
    } else if (password !== confirmedPassword) {
      notificationListener({
        message: "Passwords must match",
        type: "error",
      });
    }
  };

  return (
    <div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleRegister();
        }}
      >
        <TextField
          error={isEmailInErrorState}
          fullWidth
          helperText={
            isEmailInErrorState ? "An email address is required" : null
          }
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
        <TextField
          error={isPasswordInErrorState}
          fullWidth
          helperText={
            isPasswordInErrorState ? "A valid password is required" : null
          }
          label="Password"
          margin="normal"
          name="password"
          onBlur={() => {
            setPasswordErrorState(false);
          }}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          type="password"
          value={password}
        />
        <TextField
          error={isConfirmedPasswordInErrorState}
          fullWidth
          helperText={
            isConfirmedPasswordInErrorState
              ? "A valid password is required"
              : null
          }
          label="Confirm Password"
          margin="normal"
          name="confirm-password"
          onBlur={() => {
            setConfirmedPasswordErrorState(false);
          }}
          onChange={(event) => {
            setConfirmedPassword(event.target.value);
          }}
          type="password"
          value={confirmedPassword}
        />
        <Box sx={{ mt: 2 }}>
          <Button fullWidth size="large" type="submit" variant="contained">
            Register
          </Button>
        </Box>
      </form>
    </div>
  );
};

FirebaseRegister.propTypes = {
  notificationListener: PropTypes.func,
};

export default FirebaseRegister;
