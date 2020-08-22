import React from "react";

export function ReservationDate() {
  return (
    <>
      <h2 className={"text-xl mt-4"}>日時</h2>
      <ul className={`list-disc pl-5 leading-8`}>
        <li>
          予約日時は、
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
