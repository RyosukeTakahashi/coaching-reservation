import { otherTalkThemeAtom } from "../src/atoms";
import React from "react";
import { useRecoilState } from "recoil";

export function OtherTalkTheme() {
  const [otherTalkTheme, setOtherTalkTheme] = useRecoilState(
    otherTalkThemeAtom
  );
  return (
    <textarea
      name="otherQuestion"
      value={otherTalkTheme}
      onChange={(e) => setOtherTalkTheme(e.target.value)}
    />
  );
}
