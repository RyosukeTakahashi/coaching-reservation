import React, { FC } from "react";
import { radioAnswerWithName} from "../src/atoms";
import {useRecoilState, useSetRecoilState} from "recoil/dist";
import { setUserProfile } from "../src/fetchers";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import { teal } from "@material-ui/core/colors";
import {useUser} from "../lib/hooks";

const TealRadio = withStyles({
  root: {
    color: teal[200],
    "&$checked": {
      color: teal[400],
    },
      padding: '0.25rem 0.5rem'
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export type radioQuestionProps = {
  title: string;
  options: radioOption[];
};

export const RadioQuestion: FC<radioQuestionProps> = (props: {
  title;
  options;
}) => {
  const [user] = useUser();
  const [radioState, setRadioState] = useRecoilState(
    radioAnswerWithName(props.options[0].radioName)
  );
  return (
    <FormControl component="fieldset">
      <RadioGroup
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          setRadioState(e.target.value);
          //todo: ↓の副作用はpropsとして持ってこないとこのコンポーネントに汎用性がない
          if (user)
            await setUserProfile(user.uid, {
              [props.options[0].radioName]: e.target.value,
            });
        }}
        value={radioState}
      >
        {props.options.map((option, index) => (
          <FormControlLabel
            value={option.label}
            label={option.label}
            control={<TealRadio />}
            key={index}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
