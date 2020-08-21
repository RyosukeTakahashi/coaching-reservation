import React, { useState } from "react";
import Head from "next/head";
import firebase from "../firebase/clientApp";
import { useRecoilState } from "recoil/dist";
import {
  checkboxAnswerWithName,
  radioAnswerWithName,
  useUser,
} from "../src/atoms";
import {
  aOrT as aOrTStr,
  mbti as mbtiStr,
  talkTheme as talkThemeStr,
} from "../src/settings/inputOption";
import { setReservation, setUserProfile } from "../src/fetchers";
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
  const [otherOBTalk, setOtherOBTalk] = useState("");
  const [talkThemes, setTalkThemes] = useRecoilState(
    checkboxAnswerWithName(talkThemeStr)
  );
  const [reservations, setReservations] = useState([] as Reservation[]);
  const [howFoundMurakami, setHowFoundMurakami] = useState("");
  const preparationAnswer = {
    otherOBTalk,
    talkThemes,
    howFoundMurakami,
  };
  const [mbti, setMbti] = useRecoilState(radioAnswerWithName(mbtiStr));
  const [aOrT, setAOrT] = useRecoilState(radioAnswerWithName(aOrTStr));
  const [seikakuNavi, setSeikakuNavi] = useState("");
  const assessment = {
    mbti,
    aOrT,
    seikakuNavi,
  };
  const [snackbarState, setSnackbarState] = useState(false);
  useReservationListener(
    user,
    setReservations,
    setOtherOBTalk,
    setTalkThemes,
    setHowFoundMurakami
  );
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
          <LatestReservation
            value={otherOBTalk}
            onChange={(e) => setOtherOBTalk(e.target.value)}
            onBlur={() =>
              setReservation(user.uid, reservations[0].id, preparationAnswer)
            }
            value1={howFoundMurakami}
            onChange1={(e) => setHowFoundMurakami(e.target.value)}
            onClickHandler={async () => {
              await setReservation(
                user.uid,
                reservations[0].id,
                preparationAnswer
              );
              setSnackbarState(true);
            }}
          />
        </FormSection>

        <PersonalityAssessment
          value={seikakuNavi}
          onChange={(e) => setSeikakuNavi(e.target.value)}
          onClickHandler={async () => {
            await setUserProfile(user.uid, assessment);
            setSnackbarState(true);
          }}
        />

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
