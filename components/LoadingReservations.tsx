import { Main } from "./Main";
import { FormSection } from "./FormSection";
import React from "react";
import { useRecoilValue } from "recoil/dist";
import { userAtom } from "../src/atoms";

export function LoadingReservations() {
  const user = useRecoilValue(userAtom);
  return (
    <Main>
      <FormSection>
        <div className={"flex justify-center"}>{user.displayName}さんの予約を読込中</div>
      </FormSection>
    </Main>
  );
}
