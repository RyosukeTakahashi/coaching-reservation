import React from "react";
import { useLatestEvent } from "../lib/hooks";
import { formatTime } from "../lib/utils";

export function ReservationDate() {
  const { event, isLoading, isError } = useLatestEvent();
  const startTime = event ? formatTime(event.start) : "読込中...";
  const hangout = event ? (
    <a href={event.hangoutLink} target="_blank">
      こちらからGoogle Meetを開く
    </a>
  ) : (
    <span>読込中...</span>
  );
  return (
    <>
      <ul className={`list-disc pl-5 leading-8`}>
        <li>日時 : {startTime}</li>
        <li>場所 : {hangout}</li>
      </ul>
    </>
  );
}
