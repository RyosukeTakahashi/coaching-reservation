import { ReservationDate } from "./ReservationDate";
import { Location } from "./Location";
import { PreparationQA } from "./PreparationQA";
import { TealButton } from "./ColorButton";
import Link from "next/link";
import React from "react";

export function LatestReservation(props: {
  value: string;
  onChange: (e) => void;
  onBlur: () => Promise<void>;
  value1: string;
  onChange1: (e) => void;
  onClickHandler: () => Promise<void>;
}) {

  return (
    <>
      <h1 className={"text-2xl"}>直近の予約について</h1>
      <ReservationDate />
      <Location />
      <PreparationQA
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value1={props.value1}
        onChange1={props.onChange1}
      />
      <div className={"mt-5"}>
        <TealButton onClickHandler={props.onClickHandler}>
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
