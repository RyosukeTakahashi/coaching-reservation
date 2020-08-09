import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  calendlySettingAtom,
  radioAnswerWithName,
  useUser,
} from "../../src/atoms";
import dynamic from "next/dynamic";
import Link from "next/link";
import Head from "next/dist/next-server/lib/head";
import firebase from "../../firebase/clientApp";
import { LoginRecommendationText } from "../../components/LoginRecommendationText";
import { RadioQuestion } from "../../components/RadioQuestion";
import { Calendly, CalendlyState } from "../../components/Calendly";
import { TealButton } from "../../components/ColorButton";
import { FormSection } from "../../components/FormSection";
import { FormSectionTitle } from "../../components/FormSectionTitle";
import { meetOrVideo, radioSettings } from "../../src/settings/inputOption";
import { Assignment } from "@material-ui/icons";

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
      <Head>
        <title>予約ページ</title>
      </Head>
      <main className={"px-3 w-full max-w-screen-sm"}>
        <FormSection>
          <p>
            相談/コーチング依頼の方は、
            <br />
            以下の手順でご予約願います。
          </p>
        </FormSection>

        <FormSection>
          <FormSectionTitle title={"Googleでログインしてください"} />
          {!user && (
            <>
              <LoginRecommendationText />
              <AuthWithNoSSR />
            </>
          )}
          {user && (
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

        {user && (
          <FormSection>
            <FormSectionTitle title={"ご希望の方法をお選びください"} />
            <RadioQuestion {...radioSettings[meetOrVideo]} />
          </FormSection>
        )}

        {notText == false && meetOrVideoState != "" && (
          <FormSection>
            <FormSectionTitle title={"SNSでご連絡ください"} />
            <a href="https://twitter.com/ryo_mura_brains" target="_blank">
              Twitter
            </a>
            {" / "}
            <a
              href="https://www.facebook.com/ryo.murakami.3998"
              target="_blank"
            >
              Facebook
            </a>
          </FormSection>
        )}

        {user && notText && (
          <FormSection>
            <FormSectionTitle title={"以下から空き枠をご予約ください"} />
            <Calendly setCalendlyState={setCalendlyState} />
          </FormSection>
        )}

        {user && notText && calendlyState === CalendlyState.scheduled && (
          <>
            <FormSection>
              <p className={"text-lg"}>予約は完了です。</p>
            </FormSection>
            <FormSection>
              <FormSectionTitle title={"事前質問にお答えください"} />
              より有意義な対話のため、
              <br />
              {user.displayName}さんについてお聞かせください。
              <div className={"mt-4"}>
                <Link href="/my-page">
                  <a>
                    <TealButton
                      size={"large"}
                      fullWidth={true}
                      startIcon={<Assignment />}
                    >
                      事前質問に答える
                    </TealButton>
                  </a>
                </Link>
              </div>
            </FormSection>
          </>
        )}

        {["", "テキスト"].includes(meetOrVideoState) && (
          <div className={"mt-4"}>
            <Link href="/my-page">
              <a>
                <TealButton size={"large"}>予約済みの方はこちら</TealButton>
              </a>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
