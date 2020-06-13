import React, { FC, useEffect, useState } from "react";
import {
  useUserState,
  radioAnswerWithName,
  checkboxAnswerWithName,
  otherTalkThemeAtom,
  calendlySettingAtom,
  calendlyStateAtom,
} from "../../src/atoms";
import { useRecoilState } from "recoil";
import { InlineWidget, PopupText, CalendlyEventListener } from "react-calendly";
import dynamic from "next/dynamic";
import firebase from "../../firebase/clientApp";

const AuthWithNoSSR = dynamic(() => import("../../components/auth"), {
  ssr: false,
});

type radioOption = {
  value: string;
  label: string;
  radioName: string;
};

const RadioOption: FC<radioOption> = (props: { value; label; radioName }) => {
  const [, setFormState] = useRecoilState(radioAnswerWithName(props.radioName));
  return (
    <div className="radio_option">
      <label>
        <input
          type="radio"
          name={props.radioName}
          value={props.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormState(e.target.value)
          }
        />
        {props.label}
      </label>
    </div>
  );
};

type radioQuestionProps = {
  title: string;
  options: radioOption[];
};

const RadioQuestion: FC<radioQuestionProps> = (props: { title; options }) => {
  return (
    <div className="question">
      <div className="title">
        <p>{props.title}</p>
      </div>
      <div className="options">
        {props.options.map((option, index) => (
          <RadioOption {...option} key={index} />
        ))}
      </div>
    </div>
  );
};

type checkBoxOption = {
  value: string;
  label: string;
  radioName: string;
};

const CheckBoxOption: FC<checkBoxOption> = (props: {
  value;
  label;
  radioName;
}) => {
  const [checkboxState, setCheckboxState] = useRecoilState(
    checkboxAnswerWithName(props.radioName)
  );

  return (
    <div className="radio_option">
      <label>
        <input
          type="checkbox"
          name={props.radioName}
          value={props.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked === true) {
              setCheckboxState([...checkboxState, e.target.value]);
            } else {
              setCheckboxState(
                checkboxState.filter((choice) => choice !== e.target.value)
              );
            }
          }}
        />
        {props.label}
      </label>
    </div>
  );
};

const CheckboxQuestion = (props: { title; options }) => {
  return (
    <div className="question">
      <div className="title">
        <p>{props.title}</p>
      </div>
      <div className="checkbox_option">
        {props.options.map((option, index) => (
          <CheckBoxOption {...option} key={index} />
        ))}
      </div>
    </div>
  );
};

const generateOptions = (
  options: { value: string; label: string }[],
  radioName: string
): radioOption[] => {
  return options.map((option) => Object.assign(option, { radioName }));
};

const yes = "yes";
const yesJP = "はい";
const no = "no";
const noJP = "いいえ";
const radioNameMeet = "meetOrNot";
const meetOrVideo = "meetOrVideo";
const talkTheme = "talkTheme";

//radio, checkbox混在で、name なども変わる予定もあるので、これ以上は一旦抽象化しない
const radioSettings: { [s: string]: radioQuestionProps } = {
  [radioNameMeet]: {
    title: "ご覧いただきありがとうございます。村上と面談をご希望でしょうか？",
    options: generateOptions(
      [
        { value: yes, label: yesJP },
        { value: no, label: noJP },
      ],
      radioNameMeet
    ),
  },
  [meetOrVideo]: {
    title: "Step1. ご希望の方法をお選びください",
    options: generateOptions(
      [
        { value: "対面", label: "対面" },
        { value: "ビデオチャット", label: "ビデオチャット" },
        { value: "text", label: "テキスト" },
      ],
      meetOrVideo
    ),
  },
  [talkTheme]: {
    title: "お話になりたい内容はなんでしょうか？",
    options: generateOptions(
      [
        { value: "自己分析全般", label: "自己分析" },
        { value: "企業や働き方を知りたい", label: "働き方を知りたい" },
        { value: "強み/弱みを知りたい", label: "強み/弱みを知りたい" },
        {
          value: "自分の軸を見つけたい, 持ちたい",
          label: "自分の軸を見つけたい, 持ちたい",
        },
        { value: "目的/目標を設定したい", label: "目的/目標を設定したい" },
        {
          value: "目標達成の仕方を考えたい",
          label: "目標達成の仕方を考えたい",
        },
        { value: "村上について聞きたい", label: "村上について聞きたい" },
      ],
      talkTheme
    ),
  },
};

function OtherTalkTheme() {
  const [otherTalkTheme, setOtherTalkTheme] = useRecoilState(
    otherTalkThemeAtom
  );
  return (
    <textarea
      name="otherQuestion"
      value={otherTalkTheme}
      onChange={(e) => setOtherTalkTheme(e.target.value)}
    />
  );
}

function LoginRecommendationText() {
  return (
    <div>
      ・予約時の手入力が減り、
      <br />
      ・予約後、Googleカレンダーに予定が自動記入されます。
    </div>
  );
}

enum CalendlyState {
  datetimeSelected,
  scheduled,
}

const Calendly = React.memo((props: { setCalendlyState }) => {
  const [calendlySetting] = useRecoilState(calendlySettingAtom);
  const onScheduled = React.useCallback(() => {
    props.setCalendlyState(CalendlyState.datetimeSelected);
    document
      .getElementsByClassName("calendly-inline-widget")[0]
      .setAttribute("style", "height: 650px;");
  }, [props.setCalendlyState]);
  return (
    <CalendlyEventListener
      onEventScheduled={onScheduled}
      onDateAndTimeSelected={onScheduled}
    >
      <InlineWidget {...calendlySetting} />
    </CalendlyEventListener>
  );
});

export default function CoachingPreparation({}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [meetOrVideoState] = useRecoilState(radioAnswerWithName(meetOrVideo));
  const [user, , loadingUser] = useUserState();
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
