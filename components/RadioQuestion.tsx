import React, { FC } from "react";
import { radioAnswerWithName, useUser } from "../src/atoms";
import { useRecoilState } from "recoil";
import { useSetRecoilState } from "recoil/dist";
import { setUserProfile } from "../src/fetchers";

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
  const [radioState, setRadioState] = useRecoilState(
    radioAnswerWithName(props.radioName)
  );
  const [user] = useUser();
  console.log(radioState);
  return (
    <div className="radio_option">
      <label>
        <input
          type="radio"
          name={props.radioName}
          value={props.value}
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            setRadioState(e.target.value);
            await setUserProfile(user.uid, { [props.radioName]: e.target.value });
          }}
          checked={props.value === radioState}
        />
        {props.label}
      </label>
    </div>
  );
};
