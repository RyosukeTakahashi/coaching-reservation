import React, { useEffect, useState } from "react";
import {
  calendlySettingAtom,
  radioAnswerWithName,
  useUser,
} from "../../src/atoms";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import firebase from "../../firebase/clientApp";
import { LoginRecommendationText } from "../../components/LoginRecommendationText";
import { RadioQuestion } from "../../components/RadioQuestion";
import { Calendly, CalendlyState } from "../../components/Calendly";
import { meetOrVideo, radioSettings } from "../../src/settings/inputOption";

const AuthWithNoSSR = dynamic(() => import("../../components/auth"), {
  ssr: false,
});

export default function CoachingPreparation({}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [meetOrVideoState] = useRecoilState(radioAnswerWithName(meetOrVideo));
  const [user, , loadingUser] = useUser();
  const [calendlySetting, setCalendlySetting] = useRecoilState(
    calendlySettingAtom
  );
  const [calendlyState, setCalendlyState] = useState(0);
  useEffect(() => {
    if (!loadingUser && user) {
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
  }, [meetOrVideoState]);

  const notText = ["対面", "ビデオチャット"].includes(meetOrVideoState);
  return (
    <main className={"form"}>
      <p>相談/コーチングを依頼される方は、以下よりご予約願います。</p>
      <RadioQuestion {...radioSettings[meetOrVideo]} />

      {notText && (
        <div className="title">
          <p>Step2. Googleログインをお願いします。</p>
        </div>
      )}

      {!user && notText && (
        <>
          <LoginRecommendationText />
          <AuthWithNoSSR />
        </>
      )}

      {user && notText && (
        <>
          ログイン済みです。
          <button onClick={() => firebase.auth().signOut()}>Log Out</button>
          <div className="title">
            <p>Step3. 以下から空き枠をご予約ください。</p>
          </div>
          <Calendly setCalendlyState={setCalendlyState} />
        </>
      )}

      {user && notText && calendlyState === CalendlyState.datetimeSelected && (
        <div>
          <div className="title">
            <p>Step4. こちらより予約を確認し、事前質問にお答えください</p>
          </div>
        </div>
      )}
    </main>
  );
}
