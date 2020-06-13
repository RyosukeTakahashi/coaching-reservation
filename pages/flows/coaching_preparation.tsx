import React, { FC, useState } from "react";
import {
  useUserState,
  radioAnswerWithName,
  checkboxAnswerWithName,
  otherTalkThemeAtom,
} from "../../src/atoms";
import { useRecoilState } from "recoil";
import {
  InlineWidget,
  PopupText,
  PopupWidget,
  CalendlyEventListener,
} from "react-calendly";
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
  const [formState, setFormState] = useRecoilState(
    radioAnswerWithName(props.radioName)
  );
  console.log(formState);
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
  console.log(checkboxState);

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
    title: "どの方法をご希望でしょうか？",
    options: generateOptions(
      [
        { value: "face2face", label: "対面" },
        { value: "video", label: "ビデオチャット" },
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

//widget.jsに処理を加えられるかも？
//checkbox とかはマージしてprefill
const calendlySetting = {
  url: "https://calendly.com/ryo-murakami/meeting",
  prefill: {
    name: "",
    email: "",
  },
  styles: {
    height: "1000px",
  },
  text: "予約はこちらから",
};

//refactor
//前のが表示＆特定の値なら、表示、stateOfFormerComponent的な。あるいは非表示なら隠すとか。
//あるいは shown: 2 (2番めまでは表示)的なstateを持って、選択肢によってstateの変更→表示変更。にする。

//予約完了event listener
//→マイページ（できれば予約日表示）。
//2. 何を話したいか（選択肢＆自由記述）
//3. なぜ村上に申請したか
//4. どう検索して村上を見つけたか
//5. 他のOBとも複数話されている方は、それによって何を知り、追加で何を知りたいのか。
// 性格診断→SNS紹介

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
      Googleログインすると、
      <br />
      ・予約時の手入力が減り、
      <br />
      ・Googleカレンダーに予定が自動記入されます。
      <br />
      Googleアカウントをお持ちでない方は、カレンダーの空き枠指定時に記入願います。
    </div>
  );
}

enum CalendlyState {
  eventTypeViewed = 1,
  dateTimeSelected,
  eventScheduled,
}

export default function CoachingPreparation({}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [meetState] = useRecoilState(radioAnswerWithName(radioNameMeet));
  const [meetOrVideoState] = useRecoilState(radioAnswerWithName(meetOrVideo));
  const [talkThemeState] = useRecoilState(checkboxAnswerWithName(talkTheme));
  const [otherTalkTheme] = useRecoilState(otherTalkThemeAtom);
  const [user, loadingUser] = useUserState();
  if (!loadingUser && user) {
    calendlySetting.prefill = {
      name: user.displayName,
      email: user.email,
    };
  }
  const talkThemeChosen = talkThemeState.length > 0;
  const showLogin = !user && talkThemeChosen;
  const [calendlyState, setCalendlyState] = useState(10);
  console.log(user);
  if (calendlyState === CalendlyState.eventTypeViewed) {
    console.log("eventViewed");
  }
  return (
    <main className={"form"}>
      <RadioQuestion {...radioSettings[meetOrVideo]} />
      {["video", "face2face"].includes(meetOrVideoState) && (
        <>
          <CheckboxQuestion {...radioSettings[talkTheme]} />
          その他：
          <div>
            <OtherTalkTheme />
          </div>
        </>
      )}
      {showLogin && (
        <>
          <LoginRecommendationText />
          <AuthWithNoSSR />
        </>
      )}

      {user && (
        <button onClick={() => firebase.auth().signOut()}>Log Out</button>
      )}

      {talkThemeChosen && (
        <>
          <CalendlyEventListener
            onEventTypeViewed={function noRefCheck() {
              setCalendlyState(CalendlyState.eventTypeViewed);
            }}
            onDateAndTimeSelected={function noRefCheck() {
              setCalendlyState(CalendlyState.dateTimeSelected);
            }}
            onEventScheduled={function noRefCheck() {
              setCalendlyState(CalendlyState.eventScheduled);
            }}
          >
            <InlineWidget {...calendlySetting} />
          </CalendlyEventListener>
        </>
      )}
    </main>
  );
}
