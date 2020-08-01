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
import Link from "next/link";

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
    <main className={"form ml-4"}>
      <p className={"mt-6"}>
        相談/コーチング依頼の方は、<br/>以下の手順でご予約願います。
      </p>

      <div className="mt-6">
        <RadioQuestion {...radioSettings[meetOrVideo]} />
      </div>
      {notText && (
        <div className="mt-6">
          <div className="text-xl mb-2">
            <p>Step2. Googleでログインしてください</p>
          </div>
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
          <button className="text-blue-500 border-blue-500 border-2 p-1 rounded text-sm" onClick={() => firebase.auth().signOut()}>Log Out</button>
          <div className="mt-6">
            <div className="text-xl mb-2">
              <p>Step3. 以下から空き枠をご予約ください。</p>
            </div>
            <Calendly setCalendlyState={setCalendlyState} />
          </div>
        </>
      )}

      {user && notText && calendlyState === CalendlyState.datetimeSelected && (
        <>
          <div className="mt-6">
            <div className="text-xl mb-2">
              <p>Step4. 予約確認メールをご確認ください</p>
            </div>
            <p>
              Calendly.comからの予約確認メールをご確認ください。
            </p>
            <p>
              届いてない場合、
              <a href="https://twitter.com/ryo_mura_brains" target="_blank">
                Twitter
              </a>{" "}
              or{" "}
              <a
                href="https://www.facebook.com/ryo.murakami.3998"
                target="_blank"
              >
                Facebook
              </a>
              でお問い合わせください。
            </p>
          </div>
          <div className="mt-6">
            <div className="text-xl mb-2">
              <p>Step5. 事前質問にお応えください</p>
            </div>
            <p>
              <Link href="/my-page">
                <a>こちらから事前質問</a>
              </Link>
              にお答えください。
            </p>
          </div>
        </>
      )}
    </main>
  );
}
