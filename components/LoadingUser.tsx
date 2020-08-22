import { Main } from "./Main";
import { FormSection } from "./FormSection";
import React from "react";

export function LoadingUser() {
  return (
    <Main>
      <FormSection>
        <div className={"flex justify-center"}>ユーザーを読込中</div>
      </FormSection>
    </Main>
  );
}
