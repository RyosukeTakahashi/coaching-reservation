import { useEffect } from "react";
import firebase from "../firebase/clientApp";

export function useReservationListener(
  user,
  setReservations,
  setOtherOBTalk,
  setTalkThemes,
  setHowFoundMurakami
) {
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

export function useProfileListener(user, setAOrT, setMbti, setSeikakuNavi) {
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
