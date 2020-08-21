import firebase from "../firebase/clientApp";

export const updateServerReservation = async (uid, resId, resState) => {
  const db = firebase.firestore();
  await db
    .doc(`users/${uid}/reservations/${resId}`)
    .set(resState, { merge: true });
};

export const addReservation = async (uid) => {
  const db = firebase.firestore();
  const reservation: Reservation = {
    dateTime: Date.now(),
    otherOBTalk: "",
    talkThemes: [],
    howFoundMurakami: "",
  };
  await db.collection(`users/${uid}/reservations`).add(reservation);
};

export const getReservations = async (uid) => {
  const db = firebase.firestore();
  const userDocRef = db.doc(`users/${uid}`);
  const reservationSnapshot = await userDocRef
    .collection("reservations")
    .orderBy("dateTime", "desc") //datetimeがなければ取得できない
    .get();
  return reservationSnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
};

export const setUserProfile = async (uid, profile) => {
  const db = firebase.firestore();
  await db.doc(`users/${uid}`).set(profile, { merge: true });
};
