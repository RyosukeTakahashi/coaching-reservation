import { otherTalkThemeAtom} from "../src/atoms";
import React from "react";
import { useRecoilState } from "recoil";
import { updateServerReservation } from "../src/fetchers";
import {useUser} from "../lib/hooks";

export function OtherTalkTheme(props: { resId; preparationAnswer }) {
  const [otherTalkTheme, setOtherTalkTheme] = useRecoilState(
    otherTalkThemeAtom
  );
  const [user] = useUser();
  if (!user) return <div>loading user</div>;
  return (
    <textarea
      name="otherQuestion"
      value={otherTalkTheme}
      onChange={(e) => setOtherTalkTheme(e.target.value)}
      onBlur={() =>
        updateServerReservation(user.uid, props.resId, props.preparationAnswer)
      }
      className={"p-2 border-2 border-teal-300 rounded-lg"}
    />
  );
}
