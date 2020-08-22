import { CheckboxQuestion } from "./CheckboxQuestion";
import {
  radioSettings,
  talkTheme as talkThemeStr,
} from "../src/settings/inputOption";
import React from "react";
import { useRecoilState } from "recoil/dist";
import { howFoundMurakamiAtom, otherTalkThemeAtom } from "../src/atoms";

type QAProps = {
  onBlur: () => Promise<void>;
};

export const PreparationQA: React.FC<QAProps> = ({ onBlur }) => {
  const [otherOBTalk, setOtherOBTalk] = useRecoilState(otherTalkThemeAtom);
  const [howFoundMurakami, setHowFoundMurakami] = useRecoilState(
    howFoundMurakamiAtom
  );

  return (
    <>
      <h2 className={"text-xl mt-6 mb-5"}>事前質問</h2>
      <h3 className={"text-lg mt-7 mb-5"}>
        Q1. 他のOB/OGからは、何を学ばれましたか？
      </h3>
      <p>（なければ、「なし」とご記入ください。）</p>
      <textarea
        name="otherOBTalk"
        value={otherOBTalk}
        onChange={(e) => setOtherOBTalk(e.target.value)}
        rows={3}
        cols={30}
        onBlur={onBlur}
        className={"p-2 mb-2 border-2 border-teal-300 rounded-lg"}
      />
      <h3 className={"text-lg mt-8 mb-5"}>
        Q2. どんな内容をお話になりたいですか？
      </h3>
      <CheckboxQuestion {...radioSettings[talkThemeStr]} />
      <h3 className={"text-lg mt-8 mb-5"}>
        Q3. なぜ村上に申請いただけたでしょうか？
      </h3>
      <textarea
        name="howDidFindMurakami"
        value={howFoundMurakami}
        onChange={(e) => setHowFoundMurakami(e.target.value)}
        onBlur={onBlur}
        className={"p-2 border-2 border-teal-300 rounded-lg"}
        rows={3}
        cols={30}
      />
    </>
  );
};
