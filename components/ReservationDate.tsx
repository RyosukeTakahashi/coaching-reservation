import React from "react";
import { useLatestEvent } from "../lib/hooks";
import { formatTime } from "../lib/utils";

export function ReservationDate() {
  const { event, isLoading, isError } = useLatestEvent();
  const startTime = () => {
    if (event) return formatTime(event.start);
    if (isLoading) return <span>読込中...</span>;
    if (isError) return <span>Google Calendarの招待をご確認ください。</span>;
  };
  const zoomLink = () => {
    if (event)
      return (
        <a href={process.env.NEXT_PUBLIC_ZOOM_URL} target="_blank">
          こちらからZoomリンクを開く
        </a>
      );
    if (isLoading) return <span>読込中...</span>;
    if (isError) return <span>Google Calendarの招待をご確認ください。</span>;
  };

  return (
    <>
      <ul className={`list-disc pl-5 leading-8`}>
        <li>日時 : {startTime()}</li>
        <li>場所 : {zoomLink()}</li>
      </ul>
    </>
  );
}
