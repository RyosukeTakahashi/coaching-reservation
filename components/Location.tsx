import React from "react";
import { useLatestEvent } from "../lib/hooks";

export function Location() {
  const { event, isLoading, isError } = useLatestEvent();
  return (
    <>
      <h2 className={"text-xl mt-6"}>場所</h2>

        {event && (
            <div>
                {event.hangoutLink}
            </div>
        )}

      <a href="https://calendar.google.com/calendar/r" target="_blank">
        Googleカレンダー
      </a>
      に追加された予定（以下の画像を参考）から、Google
      Meetを時刻になったらお開きください。
      <div className={"flex justify-center"}>
        <img
          src="/images/gcal_reservation.png"
          alt="Google Calendar"
          className={"mt-4 border-2 rounded-lg"}
        />
      </div>
      <br />
      設定が不安な方は予めGoogle
      Meetでマイクテストなどをして頂けますと幸いです。
    </>
  );
}
