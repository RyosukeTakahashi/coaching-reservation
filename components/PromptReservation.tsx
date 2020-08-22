import { Main } from "./Main";
import { FormSection } from "./FormSection";
import { FormSectionTitle } from "./FormSectionTitle";
import Link from "next/link";
import React from "react";
import {userAtom} from "../src/atoms";
import {useRecoilValue} from "recoil/dist";
import {useUser} from "../lib/hooks";

export function PromptReservation() {
  const user = useRecoilValue(userAtom);
  return (
    <Main>
      <FormSection>
        <FormSectionTitle
          title={`${user.displayName}さんの予約はまだありません`}
        />
        <div>
          <Link href="/flows/coaching_preparation">
            <a>予約はこちらから</a>
          </Link>
        </div>
      </FormSection>
    </Main>
  );
}
