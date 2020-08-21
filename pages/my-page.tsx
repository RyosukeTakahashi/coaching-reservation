import React, { useState } from "react";
import Head from "next/head";
import firebase from "../firebase/clientApp";
import { useRecoilState } from "recoil/dist";
import { myPageSnackBarAtom, radioAnswerWithName, useUser } from "../src/atoms";
import { aOrT as aOrTStr, mbti as mbtiStr } from "../src/settings/inputOption";
import { setUserProfile } from "../src/fetchers";
import { Snackbar } from "@material-ui/core";
import { TealButton } from "../components/ColorButton";
import { FormSection } from "../components/FormSection";
import { useProfileListener, useReservationListener } from "../lib/hooks";
import { PreparationArticles } from "../components/PreparationArticles";
import { TwitterFollow } from "../components/TwitterFollow";
import { NextCoachingPrice } from "../components/NextCoachingPrice";
import { PersonalityAssessment } from "../components/PersonalityAssessment";
import { Main } from "../components/Main";
import { Cancellation } from "../components/Cancellation";
import { MyPageLogin } from "../components/MyPageLogin";
import { PromptReservation } from "../components/PromptReservation";
import { LatestReservation } from "../components/LatestReservation";

export default function MyPage({}: {}) {
  const [user] = useUser();
  const [reservations, setReservations] = useState([] as Reservation[]);
  const [mbti, setMbti] = useRecoilState(radioAnswerWithName(mbtiStr));
  const [aOrT, setAOrT] = useRecoilState(radioAnswerWithName(aOrTStr));
  const [seikakuNavi, setSeikakuNavi] = useState("");
  const assessment = {
    mbti,
    aOrT,
    seikakuNavi,
  };
  const [snackbarState, setSnackbarState] = useRecoilState(myPageSnackBarAtom);
  useReservationListener(user, setReservations);
  useProfileListener(user, setAOrT, setMbti, setSeikakuNavi);

  if (!user) return <MyPageLogin />;
  if (reservations.length === 0) return <PromptReservation />;
  return (
    <>
      <Head>
        <title>{user.displayName}さんの予約ページ</title>
      </Head>
      <Main>
        <FormSection>
          <LatestReservation />
        </FormSection>

        <FormSection>
          <PersonalityAssessment
            value={seikakuNavi}
            onChange={(e) => setSeikakuNavi(e.target.value)}
            onClickHandler={async () => {
              await setUserProfile(user.uid, assessment);
              setSnackbarState(true);
            }}
          />
        </FormSection>

        <FormSection>
          <PreparationArticles />
        </FormSection>

        <FormSection>
          <TwitterFollow />
        </FormSection>

        <FormSection>
          <NextCoachingPrice />
        </FormSection>

        <FormSection>
          <Cancellation />
        </FormSection>

        <div className={"mt-5 flex justify-center"}>
          <TealButton onClickHandler={() => firebase.auth().signOut()}>
            Log Out
          </TealButton>
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={snackbarState}
          autoHideDuration={2500}
          onClose={() => setSnackbarState(false)}
          message="保存しました"
        />
      </Main>
    </>
  );
}
