import { ReservationDate } from "./ReservationDate";
import { Location } from "./Location";
import { PreparationQA } from "./PreparationQA";
import { TealButton } from "./ColorButton";
import Link from "next/link";
import { useRecoilValue, useSetRecoilState } from "recoil/dist";
import {
  checkboxAnswerWithName,
  howFoundMurakamiAtom,
  myPageSnackBarAtom,
  otherTalkThemeAtom,
  reservationsAtom,
  useUser,
} from "../src/atoms";
import { talkTheme as talkThemeStr } from "../src/settings/inputOption";
import { updateServerReservation } from "../src/fetchers";

export function LatestReservation() {
  const [user] = useUser();
  const preparationAnswer = {
    otherOBTalk: useRecoilValue(otherTalkThemeAtom),
    talkThemes: useRecoilValue(checkboxAnswerWithName(talkThemeStr)),
    howFoundMurakami: useRecoilValue(howFoundMurakamiAtom),
  };
  const reservations = useRecoilValue(reservationsAtom);
  const setSnackbarState = useSetRecoilState(myPageSnackBarAtom);
  return (
    <>
      <h1 className={"text-2xl"}>直近の予約について</h1>
      <ReservationDate />
      <Location />
      <PreparationQA
        onBlur={async () =>
          await updateServerReservation(
            user.uid,
            reservations[0].id,
            preparationAnswer
          )
        }
      />
      <div className={"mt-5"}>
        <TealButton
          onClickHandler={async () => {
            await updateServerReservation(
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
