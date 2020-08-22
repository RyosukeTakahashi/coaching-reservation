import React from "react";
import { FormSectionTitle } from "./FormSectionTitle";

export function Cancellation() {
  return (
    <>
      <FormSectionTitle title={"キャンセル・日程変更について"} />
      <ul className={`list-disc pl-5 leading-8`}>
        <li>キャンセルの場合、なるべく早くお願いします。</li>
        <li>
          <a
            href="https://calendar.google.com/calendar/r/search?q=calendly"
            target="_blank"
          >
            Googleカレンダー
          </a>
          のイベント詳細から可能です。
        </li>
      </ul>
    </>
  );
}
