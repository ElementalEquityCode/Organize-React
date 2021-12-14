import { createContext, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  signInWithEmailAndPassword
} from "firebase/auth";
import PropTypes from "prop-types";
import FirebaseApp from "../Firebase";

const auth = getAuth(FirebaseApp);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === "AUTH_STATE_CHANGED") {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

export const AuthContext = createContext({
  ...initialState,
  platform: "Firebase",
  signIn: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const router = useRouter();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        if (user) {
          dispatch({
            type: "AUTH_STATE_CHANGED",
            payload: {
              isAuthenticated: true,
              user: {
                id: user.uid,
                avatar: user.photoURL,
                email: user.email,
              },
            },
          });
        } else {
          dispatch({
            type: "AUTH_STATE_CHANGED",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }),
    [dispatch]
  );

  const signIn = async (email, password) => {
    let signInError = null;

    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/dashboard");
      })
      .catch((error) => {
        signInError = error;
      });

    return signInError;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "Firebase",
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
