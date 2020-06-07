import React, { FC, useState } from "react";
import { useUser } from "../../context/userContext";
// import { atom, useRecoilState } from "recoil";

// const answerState = atom({
//   key: "answer",
//   dafault: { sample: "sample" },
// });

type radioOption = {
  value: string;
  label: string;
  radioName: string;
};

const RadioOption: FC<radioOption> = (props: { value; label; radioName }) => {
  return (
    <div className="radio_option">
      <label>
        <input type="radio" name={props.radioName} value={props.value} />
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

const generateOptions = (
  options: { value: string; label: string }[],
  radioName: string
): radioOption[] => {
  return options.map((option) => Object.assign(option, { radioName }));
};

const yes = "はい";
const no = "いいえ";
const radioNameMeet = "meetOrNot";
const meetOrVideo = "meetOrVideo";

const radioSettings: { [s: string]: radioQuestionProps } = {
  [radioNameMeet]: {
    title: "ご覧いただきありがとうございます。村上と面談をご希望でしょうか？",
    options: generateOptions(
      [
        { value: yes, label: yes },
        { value: no, label: no },
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
};

export default function CoachingPreparation({}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [answer, setAnswer] = useState({ sample: "test" });

  const { user } = useUser();
  return (
    <main className={"form"}>
      {answer.sample}
      {user && user.displayName}
      <RadioQuestion {...radioSettings[radioNameMeet]} />
      <RadioQuestion {...radioSettings[meetOrVideo]} />
    </main>
  );
}
