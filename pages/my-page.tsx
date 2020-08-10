import React, { useState } from "react";
import Link from "next/link";
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
import dynamic from "next/dist/next-server/lib/dynamic";
import { Snackbar } from "@material-ui/core";
import { TealButton } from "../components/ColorButton";
import { FormSection } from "../components/FormSection";
import { FormSectionTitle } from "../components/FormSectionTitle";
import { useProfileListener, useReservationListener } from "../lib/hooks";
import { ReservationDate } from "../components/ReservationDate";
import { Location } from "../components/Location";
import { PreparationQA } from "../components/PreparationQA";
import { PreparationArticles } from "../components/PreparationArticles";
import { TwitterFollow } from "../components/TwitterFollow";
import { NextCoachingPrice } from "../components/NextCoachingPrice";
import { PersonalityAssessment } from "../components/PersonalityAssessment";

const AuthWithNoSSR = dynamic(() => import("../components/auth"), {
  ssr: false,
});

//todo: googleログイン名前変更,(vercelドメイン変更）

export default function MyPage({}: {}) {
  const [user] = useUser();
  const [otherOBTalk, setOtherOBTalk] = useState("");
  const [talkThemes, setTalkThemes] = useRecoilState(
    checkboxAnswerWithName(talkThemeStr)
  );
  const [reservations, setReservations] = useState([{}] as Reservation[]);
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

  if (!user)
    return (
      <>
        <Head>
          <title>ログイン</title>
        </Head>
        <div className="px-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
          <main className={"px-3 w-full max-w-screen-sm"}>
            <FormSection>
              <FormSectionTitle title={"Googleでログインしてください"} />
              <div>
                予約情報の確認 / 事前質問の回答 / 性格診断結果の更新
                ができます。
              </div>
              <AuthWithNoSSR />
            </FormSection>
          </main>
        </div>
      </>
    );
  return (
    <>
      <Head>
        <title>{user.displayName}さんの予約ページ</title>
      </Head>
      <div className="px-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
        <main className={"px-3 w-full max-w-screen-sm"}>
          <div className="mt-4 px-3 py-4 bg-white rounded-lg">
            <h1 className={"text-2xl"}>直近の予約について</h1>
            <ReservationDate />
            <Location />
            <PreparationQA
              value={otherOBTalk}
              onChange={(e) => setOtherOBTalk(e.target.value)}
              onBlur={() =>
                setReservation(user.uid, reservations[0].id, preparationAnswer)
              }
              value1={howFoundMurakami}
              onChange1={(e) => setHowFoundMurakami(e.target.value)}
            />
            <div className={"mt-5"}>
              <TealButton
                onClickHandler={async () => {
                  await setReservation(
                    user.uid,
                    reservations[0].id,
                    preparationAnswer
                  );
                  setSnackbarState(true);
                }}
              >
                事前回答を保存
              </TealButton>
            </div>
            <div className={"mt-4"}>
              <Link href="/flows/coaching_preparation">
                <a>予約の取り直しはこちらから</a>
              </Link>
            </div>
          </div>

          <PersonalityAssessment
            value={seikakuNavi}
            onChange={(e) => setSeikakuNavi(e.target.value)}
            onClickHandler={async () => {
              await setUserProfile(user.uid, assessment);
              setSnackbarState(true);
            }}
          />

          <FormSection>
            <PreparationArticles user={user} />
          </FormSection>

          <FormSection>
            <TwitterFollow />
          </FormSection>

          <FormSection>
            <NextCoachingPrice />
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
        </main>
      </div>
    </>
  );
}
