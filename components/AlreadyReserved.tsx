import Link from "next/link";
import { TealButton } from "./ColorButton";
import React from "react";

export function AlreadyReserved() {
  return (
    <div className={"mt-4"}>
      <Link href="/my-page">
        <a>
          <TealButton size={"large"}>予約済みの方はこちら</TealButton>
        </a>
      </Link>
    </div>
  );
}
