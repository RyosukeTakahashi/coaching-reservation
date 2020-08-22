import { useEffect } from "react";
import firebase from "../firebase/clientApp";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil/dist";
import {
  checkboxAnswerWithName,
  howFoundMurakamiAtom,
  otherTalkThemeAtom,
  radioAnswerWithName,
  reservationsAtom,
  seikakuNaviAtom,
  userAtom,
  useUser,
} from "../src/atoms";
import {
  aOrT as aOrTStr,
  mbti as mbtiStr,
  talkTheme as talkThemeStr,
} from "../src/settings/inputOption";

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
        if (!latestReservation) return;
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
