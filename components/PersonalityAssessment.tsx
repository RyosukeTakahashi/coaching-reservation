import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from "@material-ui/styles";
import { RadioQuestion } from "./RadioQuestion";
import {
  aOrT as aOrTStr,
  mbti as mbtiStr,
  radioSettings,
} from "../src/settings/inputOption";
import { TealButton } from "./ColorButton";
import React from "react";
import {useRecoilState, useSetRecoilState} from "recoil/dist";
import {myPageSnackBarAtom, radioAnswerWithName, useUser} from "../src/atoms";

const monospaceTheme = createMuiTheme({
  typography: {
    fontFamily: 'Monaco, "monospace"',
  },
});

type AssessmentProps = {
  value: string;
  onChange: (e) => void;
  onClickHandler: () => Promise<void>;
};
export const PersonalityAssessment: React.FC<AssessmentProps> = ({
  value,
  onChange,
  onClickHandler,
}) => {
  const [user] = useUser();

  const setSnackbarState = useSetRecoilState(myPageSnackBarAtom);

    return (
    <>
      <h1 className={"text-2xl"}>性格診断</h1>
      <h2 className={"text-xl mt-4"}>16タイプ診断</h2>
      <p>
        <a
          href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88"
          target={"_blank"}
        >
          16タイプ診断をこちらからお受けください。
        </a>
      </p>
      <h3 className={"text-lg mt-5 mb-3"}>結果の4文字をお選びください。</h3>
      <ThemeProvider theme={monospaceTheme}>
        <RadioQuestion {...radioSettings[mbtiStr]} />
      </ThemeProvider>
      <h3 className={"text-lg mt-5 mb-3"}>結果の5文字目をお選びください。</h3>
      <div className={"monospace-font"}>
        <RadioQuestion {...radioSettings[aOrTStr]} />
      </div>
      <h2 className={"text-xl mt-4"}>性格ナビ診断</h2>
      <a href="https://seikakunabi.jp/question/" target={"_blank"}>
        性格ナビ診断をこちら
      </a>
      から受け、結果のURLをお貼りください。
      <div>
        <input
          name="seikakuNavi"
          value={value}
          onChange={onChange}
          className={"p-2 border-2 border-teal-300 rounded-lg"}
        />
      </div>
      <div className={"mt-5"}>
        <TealButton onClickHandler={onClickHandler}>診断結果を保存</TealButton>
      </div>
    </>
  );
};
