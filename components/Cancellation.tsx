import React from "react";

export function Cancellation() {
  return (
    <>
      <h2 className={"text-2xl"}>キャンセル・日程変更について</h2>
      キャンセルされる場合、可能な限り早くお願いします。
      <a
        href="https://calendar.google.com/calendar/r/search?q=calendly"
        target="_blank"
      >
        Googleカレンダー
      </a>
      のイベントの詳細よりお願いします。
    </>
  );
}
