import { atom, useRecoilState } from "recoil";
import { useEffect } from "react";
import firebase from "../firebase/clientApp";
import { useCollection, useDocument } from "@nandorojo/swr-firestore";

export const radioAnswerWithName = (questionName: string) => {
  return atom({
    key: `radioAnswer-${questionName}`,
    default: "",
  });
};

export const checkboxAnswerWithName = (questionName: string) => {
  return atom({
    key: `checkboxAnswer-${questionName}`,
    default: [],
  });
};

export const otherTalkThemeAtom = atom({
  key: "talkTheme",
  default: "",
});

export const calendlyStateAtom = atom({
  key: "calendlyState",
  default: 1000,
});

export const calendlySettingAtom = atom({
  key: "calendlyState",
  default: {
    url: "https://calendly.com/ryo-murakami/meeting",
    prefill: {
      name: "",
      email: "",
      customAnswers: {
        a1: "",
      },
    },
    styles: {
      height: "950px",
    },
    text: "予約はこちらから",
  },
});

export const userAtom = atom({
  key: "user",
  default: { uid: "", displayName: "", email: "", photoUrl: "" },
});

export const userLoadingAtom = atom({
  key: "userLoading",
  default: false,
});

type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  reservations: reservation[];
};

type reservation = {
  datetime: string;
  talkTheme: string[];
  coachName: string[];
};

export const useUser = (): [User, () => void, boolean] => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loadingUser, setLoadingUser] = useRecoilState(userLoadingAtom);

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
            .collection("reservations")
            .get();
          const reservations = reservationSnapshot.docs.map((doc) =>
            doc.data()
          );
          //add user to firestore if no document.
          if (userDoc.data() === undefined) {
            console.log("no user found");
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

  return [user, setUser, loadingUser];
};
