import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/clientApp";
import React from "react";
import { useUser } from "../context/userContext";
import * as firebaseui from "firebaseui";
const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      clientId: process.env.NEXT_PUBLIC_FIREBASE_AUTH_GOOGLE_WEB_CLIENT_ID,
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false, // Avoid redirects after sign-in.
  },
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO, // add localhost:3000 as origin at google api console
};

export default function Auth() {
  const { loadingUser, user } = useUser();

  return (
    <>
      <h2>Auth. Sign in/out.</h2>
      {loadingUser && (
        <div>
          <p>You are logged in. Loading user</p>
        </div>
      )}
      {!loadingUser && !user && (
        <StyledFirebaseAuth
          uiCallback={(ui) => ui.disableAutoSignIn()}
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
      {user && (
        <div>
          <p>You are Logged in.</p>
          <p>sub collection: {user.reservations[0].coachName}</p>
          <button onClick={() => firebase.auth().signOut()}>Log Out</button>
        </div>
      )}
    </>
  );
}
