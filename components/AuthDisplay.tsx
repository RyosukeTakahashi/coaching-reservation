import { FormSectionTitle } from "./FormSectionTitle";
import { LoginRecommendationText } from "./LoginRecommendationText";
import { TealButton } from "./ColorButton";
import React from "react";
import dynamic from "next/dynamic";

const AuthWithNoSSR = dynamic(() => import("./auth"), {
  ssr: false,
});

export const AuthDisplay = (props: {
  user: User;
  onClickHandler: () => Promise<void>;
}) => (
  <>
    {!props.user && (
      <>
        <FormSectionTitle title={"Googleでログインしてください"} />
        <LoginRecommendationText />
        <AuthWithNoSSR />
      </>
    )}
    {props.user && (
      <>
        <FormSectionTitle
          title={`${props.user.displayName}さんがログイン済みです。`}
        />
        <div className={"mt-2"}>
          <TealButton onClickHandler={props.onClickHandler}>Log Out</TealButton>
        </div>
      </>
    )}
  </>
);
