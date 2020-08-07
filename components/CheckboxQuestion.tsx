import React, { FC } from "react";
import { checkboxAnswerWithName } from "../src/atoms";
import { useRecoilState } from "recoil";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import {
  withStyles,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import { teal } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(-1.3),
    },
  })
);

const TealCheckbox = withStyles({
  root: {
    color: teal[400],
    "&$checked": {
      color: teal[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export const CheckboxQuestion = (props: { title; options }) => {
  const classes = useStyles();
  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormGroup>
        {props.options.map((option, index) => (
          <CheckBoxOption {...option} key={index} />
        ))}
      </FormGroup>
    </FormControl>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === true) {
      setCheckboxState((oldCheckboxesState) => [
        ...oldCheckboxesState,
        e.target.name,
      ]);
    } else {
      setCheckboxState((oldCheckboxesState) =>
        oldCheckboxesState.filter((choice) => choice !== e.target.name)
      );
    }
  };
  return (
    <div className="radio_option">
      <label>
        <TealCheckbox
          checked={checkboxState.includes(props.value)}
          name={props.value}
          onChange={handleChange}
        />
        {props.label}
      </label>
    </div>
  );
};
