import { Main } from "./Main";
import { FormSection } from "./FormSection";
import { FormSectionTitle } from "./FormSectionTitle";
import Link from "next/link";
import React from "react";

export function PromptReservation(props: { user: User }) {
  return (
    <Main>
      <FormSection>
        <FormSectionTitle
          title={`${props.user.displayName}さんの予約はまだないようです。`}
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
