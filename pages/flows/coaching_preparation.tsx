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
import { TealButton } from "../../components/ColorButton";
import { FormSection } from "../../components/FormSection";
import { FormSectionTitle } from "../../components/FormSectionTitle";

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
  }, [meetOrVideoState, user]);

  const notText = ["対面", "ビデオチャット"].includes(meetOrVideoState);
  return (
    <div className="py-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
      <main className={"px-3 w-full max-w-screen-sm"}>
        <FormSection>
          <p>
            相談/コーチング依頼の方は、
            <br />
            以下の手順でご予約願います。
          </p>
        </FormSection>

        <FormSection>
          <FormSectionTitle title={"ご希望の方法をお選びください"} />
          <RadioQuestion {...radioSettings[meetOrVideo]} />
        </FormSection>

        {notText && (
          <FormSection>
            <FormSectionTitle title={"Googleでログインしてください"} />
            {!user && notText && (
              <>
                <LoginRecommendationText />
                <AuthWithNoSSR />
              </>
            )}
            {user && notText && (
              <>
                {user.displayName}さんがログイン済みです。
                <div className={"mt-2"}>
                  <TealButton onClickHandler={() => firebase.auth().signOut()}>
                    Log Out
                  </TealButton>
                </div>
              </>
            )}
          </FormSection>
        )}

        {user && notText && (
          <FormSection>
            <FormSectionTitle title={"以下から空き枠をご予約ください"} />
            <Calendly setCalendlyState={setCalendlyState} />
          </FormSection>
        )}

        {user && notText && calendlyState === CalendlyState.datetimeSelected && (
          <>
            <FormSection>
              <FormSectionTitle title={"メールをご確認ください"} />
              <ul className={`list-disc pl-5`}>
                <li>Calendly.comからの予約完了メールをご確認ください。</li>
                <li>
                  届いてない場合、
                  <a href="https://twitter.com/ryo_mura_brains" target="_blank">
                    Twitter
                  </a>
                  or
                  <a
                    href="https://www.facebook.com/ryo.murakami.3998"
                    target="_blank"
                  >
                    Facebook
                  </a>
                  でお問い合わせください。
                </li>
              </ul>
            </FormSection>
            <FormSection>
              <FormSectionTitle title={"事前質問にお答えください"} />
              <p>
                {user.displayName}
                さんとの対話がより有意義となるよう、以下から事前質問にお答えください。
              </p>
            </FormSection>
            <div className={"mt-4"}>
              <Link href="/my-page">
                <a>
                  <TealButton>事前質問に答える</TealButton>
                </a>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
