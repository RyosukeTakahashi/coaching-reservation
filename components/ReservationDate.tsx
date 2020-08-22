import React from "react";
import { atom, useRecoilValue } from "recoil/dist";

export function ReservationDate() {
  const date = useRecoilValue(
    atom({
      key: "reservationDate",
      default: ""
    })
  );

  return (
    <>
      <h2 className={"text-xl mt-4"}>日時</h2>
      <ul className={`list-disc pl-5 leading-8`}>
        <li>
          予約日時は、{date}
          <a
            href="https://calendar.google.com/calendar/r/search?q=calendly"
            target="_blank"
          >
            Googleカレンダー
          </a>
          をご参照ください。
        </li>
        <li>
          カレンダーが見れない場合、
          <a href="https://twitter.com/ryo_mura_brains" target="_blank">
            Twitter
          </a>
          {" / "}
          <a href="https://www.facebook.com/ryo.murakami.3998" target="_blank">
            Facebook
          </a>
          でお問い合わせください。
        </li>
      </ul>
    </>
  );
}
