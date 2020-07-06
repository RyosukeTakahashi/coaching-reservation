import firebase from "../firebase/clientApp";

export const setReservation = async (uid, resId, resState) => {
  const db = firebase.firestore();
  const reservationRef = await db
    .doc(`users/${uid}/reservations/${resId}`)
    .set(resState);
};

export const getReservations = async (uid) => {
  const db = firebase.firestore();
  const userDocRef = db.doc(`users/${uid}`);
  const reservationSnapshot = await userDocRef
    .collection("reservations")
    // .orderBy("datetime", "desc") //datetimeがなければ取得できない
    .get();
  return reservationSnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
};

export const setUserProfile = async (uid, profile) => {
  const db = firebase.firestore();
  const reservationRef = await db
    .doc(`users/${uid}`)
    .set(profile, { merge: true });
};
