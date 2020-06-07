import React, { FC } from "react";

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
  radioName: string;
  options: radioOption[];
};

const RadioQuestion: FC<radioQuestionProps> = (props: {
  title;
  radioName;
  options;
}) => {
  return (
    <div className="question">
      <div className="title">
        <p>{props.title}</p>
      </div>
      <div className="options">
        {props.options.map((option) => (
          <RadioOption {...option} key={props.radioName} />
        ))}
      </div>
    </div>
  );
};

const yes = "はい";
const no = "いいえ";
const radioNameMeet = "meetOrNot";
const meetOrVideo = "meetOrVideo";

const generateOptions = (
  options: { value: string; label: string }[],
  radioName: string
): radioOption[] => {
  return options.map((option) => Object.assign(option, { radioName }));
};

const radioSettings: { [s: string]: radioQuestionProps } = {
  [radioNameMeet]: {
    title: "ご覧いただきありがとうございます。村上と面談をご希望でしょうか？",
    radioName: radioNameMeet,
    options: generateOptions(
      [
        { value: yes, label: yes },
        { value: yes, label: no },
      ],
      radioNameMeet
    ),
  },
};

export default function CoachingPreparation({}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  return (
    <main className={"form"}>
      <RadioQuestion {...radioSettings[radioNameMeet]} />
    </main>
  );
}
