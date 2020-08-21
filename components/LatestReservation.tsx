import { ReservationDate } from "./ReservationDate";
import { Location } from "./Location";
import { PreparationQA } from "./PreparationQA";
import { TealButton } from "./ColorButton";
import Link from "next/link";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil/dist";
import {
  checkboxAnswerWithName,
  howFoundMurakamiAtom,
  myPageSnackBarAtom,
  otherTalkThemeAtom,
  useUser,
} from "../src/atoms";
import { talkTheme as talkThemeStr } from "../src/settings/inputOption";
import { useReservationListener } from "../lib/hooks";
import { setReservation } from "../src/fetchers";

export function LatestReservation(props: {}) {
  const [user] = useUser();
  const [otherOBTalk, setOtherOBTalk] = useRecoilState(otherTalkThemeAtom);
  const [talkThemes, setTalkThemes] = useRecoilState(
    checkboxAnswerWithName(talkThemeStr)
  );
  const [reservations, setReservations] = useState([] as Reservation[]);
  const [howFoundMurakami, setHowFoundMurakami] = useRecoilState(
    howFoundMurakamiAtom
  );

  const preparationAnswer = {
    otherOBTalk,
    talkThemes,
    howFoundMurakami,
  };
  const setSnackbarState = useSetRecoilState(myPageSnackBarAtom);

  useReservationListener(user, setReservations);

  return (
    <>
      <h1 className={"text-2xl"}>直近の予約について</h1>
      <ReservationDate />
      <Location />
      <PreparationQA
        value={otherOBTalk}
        onChange={(e) => setOtherOBTalk(e.target.value)}
        onBlur={() =>
          setReservation(user.uid, reservations[0].id, preparationAnswer)
        }
        value1={howFoundMurakami}
        onChange1={(e) => setHowFoundMurakami(e.target.value)}
      />
      <div className={"mt-5"}>
        <TealButton
          onClickHandler={async () => {
            await setReservation(
              user.uid,
              reservations[0].id,
              preparationAnswer
            );
            setSnackbarState(true);
          }}
        >
          事前回答を保存
        </TealButton>
      </div>
      <div className={"mt-4"}>
        <Link href="/flows/coaching_preparation">
          <a>予約の取り直しはこちらから</a>
        </Link>
      </div>
    </>
  );
}
