import { CheckboxQuestion } from "./CheckboxQuestion";
import {
  radioSettings,
  talkTheme as talkThemeStr,
} from "../src/settings/inputOption";
import React from "react";

export function PreparationQA(props: {
  value: string;
  onChange: (e) => void;
  onBlur: () => Promise<void>;
  value1: string;
  onChange1: (e) => void;
}) {
  return (
    <>
      <h2 className={"text-xl mt-12"}>事前質問</h2>
      <h3 className={"text-lg mt-5 mb-3"}>
        Q1. 他のOB/OGとはどのようなことを話し、学ばれましたか？
      </h3>
      <p>（なければ、「なし」とご記入ください。）</p>
      <textarea
        name="otherOBTalk"
        value={props.value}
        onChange={props.onChange}
        rows={3}
        cols={30}
        onBlur={props.onBlur}
        className={"p-2 border-2 border-teal-300 rounded-lg"}
      />
      <h3 className={"text-lg mt-5 mb-3"}>
        Q2. どんな内容をお話になりたいですか？
      </h3>
      <CheckboxQuestion {...radioSettings[talkThemeStr]} />
      <h3 className={"text-lg mt-5 mb-3"}>
        Q3. なぜ村上に申請いただけたでしょうか？
      </h3>
      <textarea
        name="howDidFindMurakami"
        value={props.value1}
        onChange={props.onChange1}
        onBlur={props.onBlur}
        className={"p-2 border-2 border-teal-300 rounded-lg"}
        rows={3}
        cols={30}
      />
    </>
  );
}
