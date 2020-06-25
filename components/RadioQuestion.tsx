import React, { FC } from "react";
import { radioAnswerWithName } from "../src/atoms";
import { useRecoilState } from "recoil";
import { useSetRecoilState } from "recoil/dist";

export type radioQuestionProps = {
  title: string;
  options: radioOption[];
};
export const RadioQuestion: FC<radioQuestionProps> = (props: {
  title;
  options;
}) => {
  const setFormState = useSetRecoilState(
    radioAnswerWithName(props.options[0].radioName)
  );
  return (
    <div className="question">
      <div className="title">
        <p>{props.title}</p>
      </div>
      <div className="options">
        {props.options.map((option, index) => (
          <RadioOption {...option} setFormState={setFormState} key={index} />
        ))}
      </div>
    </div>
  );
};

const RadioOption: FC<radioOption> = (props: {
  value;
  label;
  radioName;
  setFormState;
}) => {
  // const setFormState = useSetRecoilState(radioAnswerWithName(props.radioName));
  return (
    <div className="radio_option">
      <label>
        <input
          type="radio"
          name={props.radioName}
          value={props.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setFormState(e.target.value)
          }
        />
        {props.label}
      </label>
    </div>
  );
};
