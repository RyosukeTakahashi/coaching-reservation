import { atom, useRecoilState } from "recoil";
import { useEffect } from "react";
import firebase from "../firebase/clientApp";
import { SetterOrUpdater } from "recoil/dist";
import { CalendlyState } from "../components/Calendly";

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

export const reservationsAtom = atom({
  key: "reservations",
  default: [] as Reservation[],
});

export const otherTalkThemeAtom = atom({
  key: "talkTheme",
  default: "",
});

export const howFoundMurakamiAtom = atom({
  key: "howFoundMurakami",
  default: "",
});

export const calendlyStateAtom = atom({
  key: "calendlyState",
  default: CalendlyState.unshown,
});

export const otherOBTalkAtom = atom({
  key: "otherOBTalk",
  default: "",
});

type CalendlySetting = {
  url: string;
  prefill: {
    name: string;
    email: string;
    customAnswers: {
      a1: string;
    };
  };
  styles: {
    height: string;
  };
  text: string;
};

const defaultCalendlySetting: CalendlySetting = {
  url: "https://calendly.com/ryo-murakami/meeting",
  prefill: {
    name: "",
    email: "",
    customAnswers: {
      a1: "",
    },
  },
  styles: {
    height: "850px",
  },
  text: "予約はこちらから",
};

export const calendlySettingAtom = atom({
  key: "calendlyState",
  default: defaultCalendlySetting,
});

export const myPageSnackBarAtom = atom({
  key: "myPageSnackBar",
  default: false,
});

const defaultUser: User = {
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
};

export const userAtom = atom({
  key: "user",
  default: defaultUser,
});

export const userLoadingAtom = atom({
  key: "userLoading",
  default: true,
});

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
            const createdAt = Date.now();
            await db.collection("users").doc(uid).set({
              displayNameInApp: displayName,
              photoURL,
              email,
              createdAt,
            });
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
