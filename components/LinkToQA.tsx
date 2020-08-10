import { FormSectionTitle } from "./FormSectionTitle";
import Link from "next/link";
import { TealButton } from "./ColorButton";
import { Assignment } from "@material-ui/icons";
import React from "react";

export function LinkToQA(props: { user: User }) {
  return (
    <>
      <FormSectionTitle title={"事前質問と性格診断にお答えください"} />
      より有意義な対話のため、
      <br />
      {props.user.displayName}さんについてお聞かせください。
      <div className={"mt-4"}>
        <Link href="/my-page">
          <a>
            <TealButton
              size={"large"}
              fullWidth={true}
              startIcon={<Assignment />}
            >
              事前質問と性格診断に答える
            </TealButton>
          </a>
        </Link>
      </div>
    </>
  );
}
