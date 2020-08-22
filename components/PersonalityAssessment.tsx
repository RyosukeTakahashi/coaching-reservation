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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil/dist";
import {
  myPageSnackBarAtom,
  radioAnswerWithName,
  seikakuNaviAtom,

} from "../src/atoms";
import { setUserProfile } from "../src/fetchers";
import {useProfileListener, useUser} from "../lib/hooks";
import { FormSectionTitle } from "./FormSectionTitle";

const monospaceTheme = createMuiTheme({
  typography: {
    fontFamily: 'Monaco, "monospace"',
  },
});

export const PersonalityAssessment: React.FC = ({}) => {
  const [user] = useUser();
  const setSnackbarState = useSetRecoilState(myPageSnackBarAtom);
  const [seikakuNavi, setSeikakuNavi] = useRecoilState(seikakuNaviAtom);
  const assessment = {
    mbti: useRecoilValue(radioAnswerWithName(mbtiStr)),
    aOrT: useRecoilValue(radioAnswerWithName(aOrTStr)),
    seikakuNavi,
  };
  useProfileListener();

  return (
    <>
      <h1 className={"text-2xl mb-5"}>性格診断</h1>
      <FormSectionTitle title={"16タイプ診断"} />
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
      <h2 className={"text-xl mt-8"}>性格ナビ診断</h2>
      <a href="https://seikakunabi.jp/question/" target={"_blank"}>
        性格ナビ診断をこちら
      </a>
      から受け、
      <br />
      結果のURLをお貼りください。
      <div className={"mt-4"}>
        <input
          name="seikakuNavi"
          value={seikakuNavi}
          onChange={(e) => setSeikakuNavi(e.target.value)}
          className={"p-2 border-2 border-teal-300 rounded-lg"}
        />
      </div>
      <div className={"mt-5"}>
        <TealButton
          onClickHandler={async () => {
            await setUserProfile(user.uid, assessment);
            setSnackbarState(true);
          }}
        >
          診断結果を保存
        </TealButton>
      </div>
    </>
  );
};
