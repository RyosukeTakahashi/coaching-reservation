import { atom, useRecoilState } from "recoil";
import { useEffect } from "react";
import firebase from "../firebase/clientApp";
import { SetterOrUpdater } from "recoil/dist";

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
  default: {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
  },
});

export const userLoadingAtom = atom({
  key: "userLoading",
  default: false,
});

//global.d.tsに後に以降
type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
};

type reservation = {
  datetime: Number;
  talkTheme: string[];
  coachName: string[];
};

export const useUser = (): [User, SetterOrUpdater<User>, boolean] => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loadingUser, setLoadingUser] = useRecoilState(userLoadingAtom);

  useEffect(() => {
    // Listen authenticated user
    // https://firebase.google.com/docs/auth/web/manage-users
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          const db = firebase.firestore();
          const userDocRef = db.doc(`users/${uid}`);
          const userDoc = await userDocRef.get();
          //add user to firestore if no document.
          if (userDoc.data() === undefined) {
            console.log("no user found");
            await db
              .collection("users")
              .doc(uid)
              .set({ displayNameInApp: displayName, photoURL });
          }

          setUser({ uid, displayName, email, photoURL });
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
