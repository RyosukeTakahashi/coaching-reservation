import React, { FC } from "react";
import { radioAnswerWithName } from "../src/atoms";
import { useRecoilState } from "recoil";

export type radioQuestionProps = {
  title: string;
  options: radioOption[];
};
export const RadioQuestion: FC<radioQuestionProps> = (props: {
  title;
  options;
}) => {
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
