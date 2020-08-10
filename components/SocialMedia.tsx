import { FormSectionTitle } from "./FormSectionTitle";
import React from "react";

export function SocialMedia() {
  return (
    <>
      <FormSectionTitle title={"SNSでご連絡ください"} />
      <a href="https://twitter.com/ryo_mura_brains" target="_blank">
        Twitter
      </a>
      {" / "}
      <a href="https://www.facebook.com/ryo.murakami.3998" target="_blank">
        Facebook
      </a>
    </>
  );
}
