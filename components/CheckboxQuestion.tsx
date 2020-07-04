import React, { FC } from "react";
import { checkboxAnswerWithName } from "../src/atoms";
import { useRecoilState } from "recoil";

export const CheckboxQuestion = (props: { title; options }) => {
  return (
    <div className="question">
      <div className="checkbox_option">
        {props.options.map((option, index) => (
          <CheckBoxOption {...option} key={index} />
        ))}
      </div>
    </div>
  );
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
              setCheckboxState((oldCheckboxesState) => [
                ...oldCheckboxesState,
                e.target.value,
              ]);
            } else {
              setCheckboxState((oldCheckboxesState) =>
                oldCheckboxesState.filter((choice) => choice !== e.target.value)
              );
            }
          }}
          checked={checkboxState.includes(props.value)}
        />
        {props.label}
      </label>
    </div>
  );
};
