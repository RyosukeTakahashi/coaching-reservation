import { useEffect } from "react";
import firebase from "../firebase/clientApp";
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil/dist";
import {
  checkboxAnswerWithName,
  howFoundMurakamiAtom,
  otherTalkThemeAtom,
  radioAnswerWithName,
  reservationsAtom,
  seikakuNaviAtom,
  userAtom,
  userLoadingAtom,
} from "../src/atoms";
import {
  aOrT as aOrTStr,
  mbti as mbtiStr,
  talkTheme as talkThemeStr,
} from "../src/settings/inputOption";
import useSWR from "swr";

export function useReservationListener() {
  const setTalkThemes = useSetRecoilState(checkboxAnswerWithName(talkThemeStr));
  const setOtherOBTalk = useSetRecoilState(otherTalkThemeAtom);
  const setHowFoundMurakami = useSetRecoilState(howFoundMurakamiAtom);
  const user = useRecoilValue(userAtom);
  const setReservations = useSetRecoilState(reservationsAtom);
  useEffect(() => {
    if (!user || user.uid === "") return;
    const db = firebase.firestore();
    const unsubscribe = db
      .collection(`users/${user.uid}/reservations`)
      .orderBy("dateTime", "desc") //datetimeがなければ取得できない
      .onSnapshot(async (querySnapshot) => {
        const reservations = await querySnapshot.docs.map((doc) => {
          const data = doc.data() as Reservation;
          return { ...data, id: doc.id };
        });
        const latestReservation = reservations[0];
        if (!latestReservation) {
          setReservations([]);
          return;
        }
        setReservations(reservations);
        setOtherOBTalk(latestReservation.otherOBTalk);
        setTalkThemes(latestReservation.talkThemes);
        setHowFoundMurakami(latestReservation.howFoundMurakami);
      });
    return () => {
      unsubscribe();
    };
  }, [user]);
}

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

export function useProfileListener() {
  const setMbti = useSetRecoilState(radioAnswerWithName(mbtiStr));
  const setAOrT = useSetRecoilState(radioAnswerWithName(aOrTStr));
  const setSeikakuNavi = useSetRecoilState(seikakuNaviAtom);

  const [user] = useUser();
  useEffect(() => {
    if (!user || user.uid === "") return;
    const db = firebase.firestore();
    const unsubscribe = db.doc(`users/${user.uid}`).onSnapshot(async (doc) => {
      setAOrT(doc.data().aOrT);
      setMbti(doc.data().mbti);
      setSeikakuNavi(doc.data().seikakuNavi);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);
}

export function useCalendlySetter(
  user,
  setCalendlySetting,
  calendlySetting,
  meetOrVideoState
) {
  useEffect(() => {
    if (user) {
      setCalendlySetting({
        ...calendlySetting,
        prefill: {
          name: user.displayName,
          email: user.email,
          customAnswers: {
            a1: meetOrVideoState,
          },
        },
      });
    }
  }, [meetOrVideoState, user]);
}

export function useLatestEvent() {
  const eventFetcher = (uri) => fetch(uri).then((res) => res.json());
  const [user] = useUser();
  const { data, error } = useSWR(
    `/api/calendarEvent/${user.email}`,
    eventFetcher
  );
  return {
    event: data,
    isLoading: !error && !data,
    isError: error,
  };
}
