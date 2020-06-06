import { useState, useEffect, createContext, useContext } from "react";
import firebase from "../firebase/clientApp";

export const UserContext = createContext({
  loadingUser: false,
  user: null,
  setUser: null,
});

export default function UserContextComp({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    // Listen authenticated user
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          const db = firebase.firestore();
          const userDocRef = db.doc(`users/${uid}`);
          const userDoc = await userDocRef.get();
          const reservationSnapshot = await userDocRef
            .collection("reservation")
            .get();
          const reservations = reservationSnapshot.docs.map((doc) =>
            doc.data()
          );
          //add user to firestore if no document.
          if (userDoc.data() === undefined) {
            await db
              .collection("users")
              .doc(uid)
              .set({ displayNameInApp: displayName, photoURL });
          }
          setUser({ uid, displayName, email, photoURL, reservations });
        } else setUser(null);
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

// @ts-ignore
export const useUser = () => useContext(UserContext); //just a shorthand
