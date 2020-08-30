import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/clientApp";
import React from "react";
import * as firebaseui from "firebaseui";

const uiConfig = {
  signInFlow: "redirect",
  signInSuccessUrl: "/flows/coaching_preparation",
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      clientId: process.env.NEXT_PUBLIC_FIREBASE_AUTH_GOOGLE_WEB_CLIENT_ID,
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: (authResult) => false, // Avoid redirects after sign-in.
  },
  // add localhost:3000 as origin at https://console.developers.google.com/apis/credentials/oauthclient/
  // firebase consoleからsecretを変える必要のある場合がある
  // https://serverfault.com/questions/949696/firebase-auth-error-getting-access-token-from-google-oidc
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

export default function Auth() {
  return (
    <StyledFirebaseAuth
      uiCallback={(ui) => ui.disableAutoSignIn()}
      uiConfig={uiConfig}
      firebaseAuth={firebase.auth()}
    />
  );
}
